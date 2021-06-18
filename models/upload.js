var mongoose = require("mongoose");
var passportlocalmongoose = require("passport-local-mongoose");
var uniqueValidator = require('mongoose-unique-validator');


var UploadSchema = new mongoose.Schema({

	userid:String,
	filename:String,
	text:String,
	reqid:[String],
	secret:String

});

module.exports = mongoose.model("Upload",UploadSchema);