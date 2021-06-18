var mongoose = require("mongoose");
var passportlocalmongoose = require("passport-local-mongoose");
var uniqueValidator = require('mongoose-unique-validator');


var RequestSchema = new mongoose.Schema({

	userid:String,
	fileid:String,
	uploadid:String,
	upermission:{type:String, default:'Denied'},
	apermission:{type:String, default:'Denied'},
	status:{type:String,default:'Denied'},
	//secret:String

});

module.exports = mongoose.model("Request",RequestSchema);