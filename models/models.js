var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	username:String,
	password:String,
	poems:String,
	poemAuthor:String,
	pubAge:String,
});