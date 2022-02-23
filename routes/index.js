const campground = require('../models/campground');

var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require('../models/user'),
	locus = require('locus'),
	Campground = require('../models/campground'),
	async = require('async'),
	nodemailer = require('nodemailer'),
	crypto = require('crypto');



router.get('/', (req, res) => {
	res.render('landing');
});

router.get('/user/:userid', function (req, res) {
	User.findById(req.params.userid, function (err, foundedUser) {
		if (err) {
			req.flash('error', 'User does not found');
			res.redirect('back');
		} else {
			Campground.find().where('author.id').equals(foundedUser._id).exec(function (err, campgrounds) {
				if (err) {
					req.flash("error", "Something went wrong.");
					return res.redirect("/");
				}
				res.render("show", { user: foundedUser, campgrounds: campgrounds });
			})
		}

	})
});

//Auth Routes
router.get('/login', function (req, res) {
	res.render('login',{page:'login'});
});

router.get('/register', function (req, res) {
	res.render('register',{page:'register'});
});

router.post('/login', passport.authenticate('local', {
	successFlash:'Welcome to YelpCamp!',
	successRedirect: '/campgrounds',
	failureRedirect: '/login', failureFlash: true
}), function (req, res) {
});

router.get('/logout', function (req, res) {
	req.logout();
	req.flash('success', 'Logged You Out');
	res.redirect('/campgrounds');
});


router.post('/register', function (req, res) {
	var newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		avatar: req.body.avatar,
		email: req.body.email
	});


	if (req.body.adminCode == "gondi")
		newUser.isAdmin = true;
	console.log(newUser);
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			req.flash('error', err.message);
			return res.redirect('register');
		}
		passport.authenticate('local')(req, res, function () {
			req.flash('success', 'Hi ' + req.body.username + ' Welcome to YelpCamp');
			res.redirect('/campgrounds');
		});
	});
});

//forgot routes

router.get('/forgot', function (req, res) {
	res.render('forgot');
});

router.post('/forgot', function (req, res, next) {
	async.waterfall([
		function (done) {
			crypto.randomBytes(20, function (err, buf) {
				var token = buf.toString('hex');
				done(err, token);
			});
		},
		function (token, done) {
			User.findOne({ email: req.body.email }, function (err, user) {
				if (!user) {
					req.flash('error', 'No account with that email address exits.');
					return res.redirect('/forgot');
				}
				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000;
				user.save(function (err) {
					done(err, token, user);
				});
			});
		},
		function (token, user, done) {
			var smtpTransport = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
					user: 'ssaksham882@gmail.com',
					pass: 'Goni@1999'
				}
			});
			var mailOptions = {
				to: user.email,
				from: 'ssaksham882@gmail.com',
				subject: 'YelpCamp Password Reset',
				text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
					'Please click on the following link, or paste this into your browser to complete the process. \n \n' +
					'http://' + req.headers.host + '/reset/' + token + 
					'\n\n' +
					'If you did not request this, please ignore this email and your password will remain unchanged.\n'
			};
			smtpTransport.sendMail(mailOptions, function (err) {
				console.log('mail send');
				req.flash('success', 'An e-mail has been sent to ' + user.email + 'with reset link. Link will be valid for next 60 minutes.')
				done(err, 'done');
			});
		}
	], function (err) {
		if (err) return next(err);
		res.redirect('/forgot');
	});
});

router.get('/reset/:token',function(req,res){
User.findOne({resetPasswordToken:req.params.token,resetPasswordExpires:{$gt:Date.now()}},function(err,user){
if(!user){
	req.flash('error','Password reset link is invalid or has expired.');
	return res.redirect('/forgot');
}
res.render('reset',{token:req.params.token});
});
});


router.post('/reset/:token', function(req, res) {
	async.waterfall([
	  function(done) {
		User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
		  if (!user) {
			req.flash('error', 'Password reset token is invalid or has expired.');
			return res.redirect('back');
		  }
		  if(req.body.password === req.body.confirm) {
			user.setPassword(req.body.password, function(err) {
			  user.resetPasswordToken = undefined;
			  user.resetPasswordExpires = undefined;
  
			  user.save(function(err) {
				req.logIn(user, function(err) {
				  done(err, user);
				});
			  });
			})
		  } else {
			  req.flash("error", "Passwords do not match.");
			  return res.redirect('back');
		  }
		});
	  },
	  function(user, done) {
		var smtpTransport = nodemailer.createTransport({
		  service: 'Gmail', 
		  auth: {
			user: 'ssaksham882@gmail.com',
			pass: 'Goni@1999'
		  }
		});
		var mailOptions = {
		  to: user.email,
		  from: 'ssaksham882@gmail.com',
		  subject: 'Your password has been changed',
		  text: 'Hello,\n\n' +
			'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
		};
		smtpTransport.sendMail(mailOptions, function(err) {
		  req.flash('success', 'Success! Your password has been changed.');
		  done(err);
		});
	  }
	], function(err) {
	  res.redirect('/campgrounds');
	});
  });
  















module.exports = router;
