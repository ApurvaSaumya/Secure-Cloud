var mongoose = require("mongoose");
var passportlocalmongoose = require("passport-local-mongoose");
var uniqueValidator = require('mongoose-unique-validator');


var UserSchema = new mongoose.Schema({

	username:{type: String, unique: true},
	email:{type:String, unique: true},
	password:String,
	ip:String,
	everified:{type:String,default:'False'},
	status:String

});

UserSchema.plugin(uniqueValidator);

//UserSchema.plugin(passportlocalmongoose);

module.exports = mongoose.model("User",UserSchema);