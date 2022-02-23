var express = require('express'),
	app = express(),
	bodyparser = require('body-parser'),
	mongoose = require('mongoose'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	seedDB = require('./seeds'),
	User= require('./models/user'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	passportLocalMongoose = require('passport-local-mongoose'),
	passport = require('passport'),
	flash = require('connect-flash');


var commentRoutes = require('./routes/comments'),
	campgroundRoutes = require('./routes/campgrounds'),
	indexRoutes = require('./routes/index');

// seedDB();



mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyparser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Passport Configuration
app.use(require('express-session')({
	secret:'Goni is Best',
	resave:false,
	saveUninitialized:false
}));



app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// passport.authenticate('local', { successFlash: 'Welcome!' });
// Passport end

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});
app.use(indexRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);

app.listen(3000, () => console.log(`Listening at http://localhost:${3000}`))