var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleObj ={};

middleObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error','You need to be logged in to do that!');
	res.redirect('/login');
};

middleObj.checkCampgroundOwnership = function(req,res,next){
	if(req.isAuthenticated()){
	Campground.findById(req.params.id,function(err,foundedcampground){
		if(err ||!foundedcampground){
			req.flash('error','Campground not found');
			res.redirect('/campgrounds');
		}else{
			// console.log(foundedcampground.author.id);
			// console.log(req.user._id);
			if(foundedcampground.author.id.equals(req.user._id)||(req.user.isAdmin))
			next();
			else{
				req.flash('error','You dont have permission to do that');
				res.redirect("back");
		}}
	});
	}else{
		req.flash('error','You need to be logged in to do that');
		res.redirect("back");
	}
};

middleObj.checkCommentOwnership =  function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundedcomment){
			// console.log(foundedcomment.author.id);
			// console.log(req.user._id);
			console.log('got gere');
			if(err||!foundedcomment){
				console.log("wrong2");
				req.flash('error','Comment not found');
				return res.redirect('/campgrounds');
			}if(foundedcomment.author.id.equals(req.user._id)||(req.user.isAdmin)){
				console.log("come");
			   next();
			}else{
				req.flash('error','You dont have permission to do that');
				res.redirect('back');
		    }
		});
	}else{
		req.flash('error','You need to be logged in to do that');
		res.redirect('back');
	}
}
module.exports = middleObj;

