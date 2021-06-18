var express = require("express");

var app = express();

var bodyParser = require("body-parser");

var request = require("request");

var mongoose = require("mongoose");

var cheerio = require('cheerio');

var rp = require('request-promise');

var atob = require('atob');

var btoa = require('btoa');

var uniqueValidator = require('mongoose-unique-validator');

var bcrypt = require('bcrypt');

var CryptoJS = require('crypto-js');

mongoose.connect("mongodb://localhost/cloud");

var passport = require("passport");

var localStrategy = require("passport-local");

var nodemailer = require("nodemailer");



var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'citizenglobal0@gmail.com',
    pass: 'qwerty@66'
  }
});

app.use( express.static( "public" ) );

var User = require("./models/user");

var Upload = require("./models/upload");

var Request = require("./models/request");


app.use(require("express-session")({
	secret:"ABC is the best",
	resave:false,
	saveUninitialized:false
}));

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new localStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());



app.use(bodyParser.urlencoded({extended:true}));


app.get("/",function(req,res){

res.render("landing.ejs")

});

//===========
//signup
//===========
var uid="";
app.get("/signup",function (req,res) {
	
	res.render("signup.ejs");
});

app.post("/signup",function (req,res) {
	var pass = req.body.password+req.body.ip.substring(0,6);

	bcrypt.hash(pass, 10, function(err, hash) {

	User.create({username:req.body.username,email:req.body.email,password:hash,ip:req.body.ip,status:"Pending"},function(err,user)
	{
		if(err)
		{
			console.log(err);
			res.redirect("/signup");
		}
		else
		{

			uid = user._id;
			//+++++++++++++++++++++++
			//Email Verification link
			//+++++++++++++++++++++++

			var link = "http://localhost:3000/verifyUserEmail/"+uid;


			var mailOptions = {
  					from: 'citizenglobal0@gmail.com',
  					to: user.email,
  					subject: 'EMAIL VERIFICATION',
  					html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
					};

					transporter.sendMail(mailOptions, function(error, info){
  					if (error) {
    					console.log(error);
  					}
  					else {
    					console.log('Email sent: ' + info.response);
  					}
					});

			res.redirect("/userpage");
		}

	});

	});
});

//===============
//LOGIN
//===============


app.get("/login",function (req,res) {
	res.render("userlogin.ejs");
});

app.post("/login", function(req,res)
{
	User.findOne({username:req.body.username},function(err,user)
	{
		if(err)
		{
			console.log(err);
			res.redirect("/login");
		}
		else
		{
			var pass = req.body.password+req.body.ip.substring(0,6);
			bcrypt.compare(pass, user.password, function(errr, rese) { 
  				if(rese) {
  					uid = user._id;
  					console.log("Logged in user details");
  					console.log(user);
   					res.redirect("/userpage");
  				} else {
  					console.log("error");
   					res.redirect("/login");
  			} 
		});
	}
	});
});

//========
//logout
//========

app.get("/logout",function (req,res) {
	uid="";
	res.redirect("/");
});




//=============
//userpage
//=============

app.get("/userpage",isLoggedIn,function(req,res)
{
	User.findOne({_id:uid},function(err,user)
	{
		if(err)
		{
			console.log(err);
			res.redirect("/login");
		}
		else
		{
		res.render("userpage.ejs",{user:user});
		}
	});
	
});



//=====================
//Verify Email
//=====================

app.get("/verifyUserEmail/:id",function(req,res)
{

 	User.findOneAndUpdate({_id:req.params.id},{$set:{everified:"True"}},function(er,usr)
 	{
 		if(er)
 		{
 			console.log(er);
 		}
 		else
 		{
 			res.redirect("/userpage");
 		}
 	});
});





//===============
//Saving Data
//===============

app.get("/upload",isLoggedIn,function(req,res){
	res.render("upload.ejs");
});

app.post("/upload",function(req,res)
{

	var s1 = Math.floor(Math.random()*(989-100+1)+100);
	var s2 = s1+10;
	var sec = s1+"-"+s2;
	//bcrypt.hash(req.body.text, 10, function(err, hash) {


	//========================
	//Encryption of text
	//========================
	var hash = ""; 
	var raw = req.body.text;
	var txt = tokenize(raw);
  	const passphrase = '12345678';
  	hash = CryptoJS.AES.encrypt(txt, passphrase).toString();
	console.log("Encrypted text "+hash);


	Upload.create({userid:uid,filename:req.body.name,text:hash,secret:sec},function(err,text)
	{
		if(err)
		{
			console.log(err);
			res.redirect("/upload");
		}
		else
		{
			//console.log(text.text);
			res.redirect("/userpage");
		}
	});
	
	//});
});


//=================
// Tokenize Text
//=================

function tokenize(raw)
{
	var token = btoa(raw)
	console.log("Tokenized text "+token);
	return token;
}

//=================
//Detokenize text
//=================

function detokenize(crypt)
{
	var raw = atob(crypt);
	return raw;
} 


//=======================
//searching and viewing
//=======================

app.get("/search",isLoggedIn,function(req,res)
{
	Upload.find({},function(er,file)
	{
		if(er)
		{
			console.log(er);
			res.redirect("/search");
		}
		else
		{
			Request.find({userid:uid},function(err,requ)
			{
				if(err)
				{
					res.redirect("/search");
					console.log(err);
				}
				else
				{
					//console.log("1");
					res.render("searchFile.ejs",{file:file,requ:requ,uid:uid});
				}
			});
		}
	});
});


//========================
//Request
//========================


app.get("/request/:id/:id2",isLoggedIn,function(req,res)
{


	Upload.findOneAndUpdate({_id:req.params.id},{$push:{reqid:uid}},function(err, file)
	{
		if(err)
		{
			console.log(err);
			res.redirect("/userpage");
		}
		else
		{
			Request.create({userid:uid,fileid:req.params.id,uploadid:req.params.id2},function(er,rq)
			{
				if(er)
				{
					console.log(er);
					res.redirect("/userpage");
				}
				else
				{
					res.redirect("/search");
				}
			});
		}
	});
});




//===============
//View File
//===============

app.get("/view/:id",isLoggedIn,function(req,res)
{
	Request.findOne({userid:uid,fileid:req.params.id,status:"Approved"},function(err,reqs)
	{
		if(err)
		{
			console.log(err);
			res.redirect("/search");
		}
		if(!reqs)
		{
			var z = "Your Request awaits confirmation";
			res.render("confirm.ejs",{z:z});
		}
		else
		{
			Upload.findOne({_id:req.params.id},function(errr,file)
			{
				if(errr)
				{
					console.log(errr);
					res.redirect("/search");
				}
				else
				{
					//========================
					//Decryption of text
					//========================
					var crypt = file.text;
  						const passphrase = '12345678';
  						const bytes = CryptoJS.AES.decrypt(crypt, passphrase);
 						 const raw = bytes.toString(CryptoJS.enc.Utf8);
 						 var originalText = detokenize(raw);

					res.render("view.ejs",{file:file,req:reqs,text:originalText});
				}
			});
		}
	});
});

//===============
//accept 
//===============

app.get("/accept",isLoggedIn,function(req,res)
{
	Request.find({uploadid:uid},function(err,file)
	{
		if(err)
		{
			console.log(err);
			res.redirect("/userpage");
		}
		else
		{
			Upload.findOne({userid:uid},function(er,fil){
				res.render("approve.ejs",{file:file,name:fil});
			});
			
		}
	});
});

app.get("/accept/:id1/:id2",function(req,res)
{
	var s1 = Math.floor((Math.random() * 989) + 1);
	var s2 = s1+10;
	var sec = s1+"-"+s2;
	sec = sec.toString();
	Request.findOneAndUpdate({fileid:req.params.id1,userid:req.params.id2},{$set:{upermission:"Approved"}},function(err,file)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
				
				res.redirect("/accept");
		}
	});
});









//============
//isloggedin
//============

function isLoggedIn(req,res,next) {
	if(uid!="")
	{
		//console.log(uid);
		return next();
	}
	res.redirect("/login");
}



//=================
//adminlogin
//=================

app.get("/alogin",function(req,res)
{
	res.render("adminlogin.ejs");
});

app.post("/alogin",function(req,res)
{
	if(req.body.username=="admin" && req.body.password == "cloud")
	{
		res.redirect("/adminpage");
	}
	else
	{
		console.log("Incorrect credentials");
		res.render("adminlogin.ejs");
	}
});


app.get("/adminpage",function(req,res)
{
	User.find({},function(err,user)
		{
			res.render("adminpage.ejs",{user:user});
		});
});



app.get("/approve/:id",function(req,res)
{
	User.findOneAndUpdate({username:req.params.id},{$set:{status:"Approved"}},function(err,query){
		if(err)
		{
			console.log(err);
			res.redirect("/adminpage");
		}
		else
		{
			res.redirect("/adminpage");
		}
	});
});


app.get("/adminaccept",function(req,res)
{
	Request.find({},function(err,file)
	{
		if(err)
		{
			console.log(err);
			res.redirect("/adminpage");
		}
		else
		{
			res.render("adapprove.ejs",{file:file});
		}
	});
});

app.get("/adminaccept/:id1/:id2",function(req,res)
{
	Request.findOneAndUpdate({fileid:req.params.id1,userid:req.params.id2},{$set:{apermission:"Approved",status:"Approved"}},function(err,file)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			Upload.findOne({_id:req.params.id1},function(errr,det)
			{
				if(errr)
				{
					console.log(errr);
				}
				User.findOne({_id:req.params.id2},function(er,usr)
				{
					if(er)
					{
						console.log(er);
					}
					console.log("Tokenized File Name:")
					console.log(det._id);

					var mailOptions = {
  					from: 'citizenglobal0@gmail.com',
  					to: usr.email,
  					subject: 'Request File Details',
  					text: 'Remember this to view file : '+det.secret 
					};

					transporter.sendMail(mailOptions, function(error, info){
  					if (error) {
    					console.log(error);
  					}
  					else {
    					console.log('Email sent: ' + info.response);
  					}
					});

					res.redirect("/adminaccept");



				});
			});
		}
	});
});










//=========
//port
//=========

var port = 3000||process.env.port;
app.listen(port,function(){
	console.log("Listening at 3000");
});