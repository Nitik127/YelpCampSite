var express = require('express'),
	router = express.Router({ mergeParams: true }),
	Campground = require('../models/campground'),
	Comment = require('../models/comment'),
	middleware = require('../middleware');

//Comments routes

router.get('/new', middleware.isLoggedIn, (req, res) => {
	var id = req.params.id;
	Campground.findById(id, function (err, campground) {
		if (err||!campground){
			req.flash('error','Campground not found');
			res.redirect('back');
		}
		else {
			res.render('comments/new', { campground, campground });
		}
	});
});

router.get('/:comment_id/edit', middleware.checkCommentOwnership , function (req, res) {
	Campground.findById(req.params.id, function (err, campground) {
		if (err ||!campground){
		    req.flash("error","Campground not found");
			res.redirect('back');
		}
		 Comment.findById(req.params.comment_id, function (err, foundedcomment) {
			if (err|| !foundedcomment){
				console.log("wrong");
				req.flash("error","Comment not found");
				res.redirect('back');
				return;
			}
			else{
				// res.redirect('/campgrounds');
				res.render('comments/edit', { comment: foundedcomment,campground:campground });

			}	
		});
	});
});

router.put('/:comment_id/',middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,comment){
		if(err){
			req.flash('error','Campground Not found!');
			res.redirect("back");
		}
		 else{
			 req.flash('Comment Updated Successfully!');
			res.redirect("/campgrounds/"+req.params.id+"/");
		 }
	});
});

router.delete('/:comment_id',middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndDelete(req.params.comment_id,function(err){
		req.flash('error','Comment Deleted Successfully!');
		res.redirect("/campgrounds/"+req.params.id+"/");

	});
});



router.post('/', (req, res) => {
	var id = req.params.id;
	Campground.findById(id, function (err, campground) {
		if (err) console.log(err);
		else {
			Comment.create(req.body.comment, function (err, comment) {
				if (err) {
					console.log(err);
					res.redirect('/campgrounds');
				} else {
					// console.log(req.user.username);
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash('success','Comment Added Successfully!');
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

module.exports = router;