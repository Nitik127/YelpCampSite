//Campgrounds routes



//Comments routes
app.get('/campgrounds/:id', (req, res) => {
	var id = req.params.id;
	Campground.findById(id).populate('comments').exec(function(err, foundedcampground) {
			if (err) res.send('Not found');
			else {
				res.render('campgrounds/show', { campground: foundedcampground });
			}
		});
});




app.get('/campgrounds/:id/comments/new',isLoggedIn,(req,res)=>{
	var id = req.params.id;
	Campground.findById(id,function(err,campground){
		if(err)
			console.log(err);
		else{
			res.render('comments/new',{campground,campground});
		}
	});
})

app.post('/campgrounds/:id/comments',(req,res)=>{
		var id = req.params.id;
	Campground.findById(id,function(err,campground){
		if(err)
			console.log(err);
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err)
					{
						console.log(err);
						res.redirect('/campgrounds');
					}else{
						campground.comments.push(comment);
						campground.save();
						res.redirect('/campgrounds/'+campground._id);
					}
			});
		}
	});
});

//Auth Routes
app.get('/login',function(req,res){
	res.render('login');
});

app.get('/register',function(req,res){
	res.render('register');
});

app.post('/login',passport.authenticate('local',{
successRedirect:'/campgrounds',
	failureRedirect:'/login'
}),function(req,res){	
});

app.get('/logout',function(req,res){
	req.logout();
	res.redirect('/campgrounds');
});


app.post('/register',function(req,res){
		var newUser = new User({username:req.body.username});
	    User.register(newUser,req.body.password,function(err,user){
			if(err){
				console.log(err);
				return res.redirect('register');
			}
			passport.authenticate('local')(req,res,function(){
			res.redirect('/campgrounds');
			});
		});
});