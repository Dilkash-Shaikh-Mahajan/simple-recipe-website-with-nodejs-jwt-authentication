const mongoose = require('mongoose');
mongoose
	.connect(
		'mongodb+srv://dilkash786:dilkash786@cluster0.t7ji2.mongodb.net/FoodReceipe',
		{ useNewUrlParser: true, useUnifiedTopology: true },
	)
	.then(() => {
		console.log('Database Connection Successfull');
	})
	.catch((err) => {
		console.log(err);
	});
