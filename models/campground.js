var mongoose = require('mongoose');
var campgroundSchema = new mongoose.Schema({
	name: String,
	price:String,
	image: String,
	description: String,
	public_id:String,
	comments:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	author:
	{
		id:{
		type:mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	username:String
}});

module.exports = mongoose.model('Campground', campgroundSchema);