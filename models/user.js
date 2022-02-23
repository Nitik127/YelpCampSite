var mongoose = require('mongoose'),
	passportLocalMongoose = require('passport-local-mongoose');

var userSchema = mongoose.Schema({
	firstName:String,
	lastName:String,
	avatar:String,
	email:{type:String,unique:true,required:true},
	username:{type:String,unique:true,required:true},
	password:String,
	isAdmin:{type:Boolean,default:false},
	resetPasswordToken:String,
	resetPasswordExpires:Date
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);

