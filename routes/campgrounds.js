var express = require('express'),
	router = express.Router(),
	Campground = require('../models/campground'),
	middleware = require('../middleware'),
	multer = require("multer");
require('locus');
require('dotenv').config();

// function errorHandler (err, req, res, next) {
// 	console.log("come here");
// 	if (res.headersSent) {
// 	  return next(err)
// 	}
// 	res.status(500)
// 	res.render('error', { error: err })
//   }

var storage = multer.diskStorage({
	filename: function (req, file, cb) {
		cb(null, Date().now + file.originalname);
	}
});

var imageFilter = function (req, file, cb) {
	// accept image files only
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
		cb(new Error('Only image files are allowed!'), false);
	}
	cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter });


var cloudinary = require('cloudinary').v2;
cloudinary.config({
	cloud_name: 'ssaksham',
	api_key: '928732191498947',
	api_secret: '5EFEfpiBETcgBH7sbZi_B4rZ0BE'
});

router.get('/', (req, res) => {
	var noMatch;
	if (req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Campground.find({ name: regex }, function (err, allCampgrounds) {
			if (err) {
				req.flash('error', 'Campground Not Fround');
				res.redirect('/');
			}
			else {
				if (allCampgrounds.length < 1)
					noMatch = "No campgrounds match that query,please try again.";
				res.render('campgrounds/index', { campgrounds: allCampgrounds, noMatch: noMatch });
			}
		});
	} else {
		Campground.find({}, function (err, allCampgrounds) {
			if (err) {
				req.flash('error', 'Campground Not Fround');
				res.redirect('/');
			}
			else res.render('campgrounds/index', { campgrounds: allCampgrounds, noMatch: noMatch, page: 'campgrounds' });
		});
	}
});

router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

router.get('/:id/edit', middleware.checkCampgroundOwnership, function (req, res) {
	Campground.findById(req.params.id, function (err, foundedcampground) {
		if (err) {
			req.flash('error', 'Campground not found');
			res.redirect('back');
		}
		res.render('campgrounds/edit', { campground: foundedcampground });
	});
});


router.put('/:id/', middleware.checkCampgroundOwnership, function (req, res) {
	upload.single('image')(req, res, function (err) {
		if (err) {
			req.flash('error', err.message);
			return res.redirect('back');
		}
	

	if (req.file != null)
		console.log("yes");
	console.log("yes2");
	console.log("gfd");
	Campground.findById(req.params.id, function (err, campground) {
		if (req.file != null) {
			console.log("with image");
			cloudinary.uploader.destroy(campground.public_id, function (error, result) {
				console.log(result, error)
			});
			cloudinary.uploader.upload(req.file.path, function (error, result) {
				req.body.campground.image = result.secure_url;
				req.body.campground.public_id = result.public_id;

				Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, newCampground) {
					if (err) {
						req.flash('error', 'Campground not found');
						res.redirect('/campgrounds');
					}
					req.flash('success', 'Campground Updated!');
					res.redirect('/campgrounds/' + req.params.id);
				});
			});
		} else {
			Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, newCampground) {
				console.log("without image");
				if (err) {
					req.flash('error', 'Campground not found');
					res.redirect('/campgrounds');
				}
				req.flash('success', 'Campground Updated!');
				res.redirect('/campgrounds/' + req.params.id);
			});
		}
	});

	})
});

router.delete('/:id', middleware.checkCampgroundOwnership, function (req, res) {
	Campground.findById(req.params.id, function (err, campground) {
		cloudinary.uploader.destroy(campground.public_id, function (error, result) {
			console.log(result, error)
		});
	});
	Campground.findByIdAndDelete(req.params.id, function (err) {
		req.flash('error', 'Campground Deleted!');
		res.redirect('/campgrounds');
	});
});

router.get('/:id', (req, res) => {
	var id = req.params.id;
	Campground.findById(id).populate('comments').exec(function (err, foundedcampground) {
		if (err) {
			req.flash('error', 'Campground not found');
			res.redirect('back');
		}
		else {
			res.render('campgrounds/show', { campground: foundedcampground });
		}
	});
});



router.post('/', middleware.isLoggedIn, function (req, res) {
	// eval(require('locus'));
	// // console.log(req.user);
	// // var name = req.body.name;
	// // var image = req.body.image;
	// // var price = req.body.price;
	// // var description = req.body.desc;
	upload.single('image')(req, res, function (err) {
		if (err) {
			req.flash('error', err.message);
			console.log("error");
			return res.redirect('back');
		}
	


	cloudinary.uploader.upload(req.file.path, function (error, result) {
		req.body.campground.image = result.secure_url;
		req.body.campground.public_id = result.public_id;
		// add author to campground
		req.body.campground.author = {
			id: req.user._id,
			username: req.user.username
		}
		// console.log(result);
		Campground.create(req.body.campground, function (err, newCampground) {
			if (err) {
				req.flash('error', 'Campground not added! Try Again.')
				res.redirect('/campgrounds');
			} else {
				req.flash('success', 'New Campground Added!');
				res.redirect('/campgrounds');
			}
		});

	});
	})
	//  var newCampground = { name: name, price: price, image: image, description: description, author: author };



});
function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
