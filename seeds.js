var mongoose = require('mongoose'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment');

var data = [
	{
		name: 'Kanyakumari',
		image:
			'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non convallis mi, at mattis arcu. Vivamus a purus tortor. Sed sodales lorem odio, aliquam varius magna dapibus vitae. Maecenas malesuada volutpat diam. Ut in ultricies urna. Pellentesque a tortor faucibus, sollicitudin libero a, convallis massa. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent mattis sapien at metus dapibus pulvinar. Aliquam sed euismod augue, nec tincidunt nisi. Quisque faucibus metus nec nunc euismod, non ullamcorper neque posuere. Donec dapibus volutpat elit a mollis. Vestibulum placerat mi massa, malesuada feugiat mi posuere ac. Sed porttitor efficitur velit sit amet.'
	},
	{
		name: 'Dehradun',
		image:
			'https://images.unsplash.com/photo-1472431983446-df737cd5b8bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non convallis mi, at mattis arcu. Vivamus a purus tortor. Sed sodales lorem odio, aliquam varius magna dapibus vitae. Maecenas malesuada volutpat diam. Ut in ultricies urna. Pellentesque a tortor faucibus, sollicitudin libero a, convallis massa. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent mattis sapien at metus dapibus pulvinar. Aliquam sed euismod augue, nec tincidunt nisi. Quisque faucibus metus nec nunc euismod, non ullamcorper neque posuere. Donec dapibus volutpat elit a mollis. Vestibulum placerat mi massa, malesuada feugiat mi posuere ac. Sed porttitor efficitur velit sit amet.'
	},
	{
		name: 'Shimla',
		image:
			'https://images.unsplash.com/uploads/1412693425217cfc81db7/a4b1437f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1053&q=80',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non convallis mi, at mattis arcu. Vivamus a purus tortor. Sed sodales lorem odio, aliquam varius magna dapibus vitae. Maecenas malesuada volutpat diam. Ut in ultricies urna. Pellentesque a tortor faucibus, sollicitudin libero a, convallis massa. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent mattis sapien at metus dapibus pulvinar. Aliquam sed euismod augue, nec tincidunt nisi. Quisque faucibus metus nec nunc euismod, non ullamcorper neque posuere. Donec dapibus volutpat elit a mollis. Vestibulum placerat mi massa, malesuada feugiat mi posuere ac. Sed porttitor efficitur velit sit amet.'
	}
];
function seedDB() {
	Campground.remove({}, function(err) {
		if (err) console.log(err);
		else {
			console.log('Campgrounds removed');
			data.forEach(function(seed) {
				Campground.create(seed, function(err, campground) {
					if (err) console.log(err);
					else {
						console.log('New campground saved');
						Comment.create({ author: 'Amar Das', text: 'Really a good place to visit. Feels so fresh.' }, function(err,newcomment) {
							campground.comments.push(newcomment);
							campground.save();
							console.log("Created NEw Comment");
						});
					}
				});
			});
		}
	});
	// Campground.create(campgrounds);
}
module.exports = seedDB;