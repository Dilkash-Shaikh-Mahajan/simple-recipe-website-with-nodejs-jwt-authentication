const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const signupSchema = new mongoose.Schema({
	fullName: {
		type: String,
		required: true,
	},
	userName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
	},
	mobile: {
		type: Number,
		required: true,
		minlength: 10,
		maxlength: 10,
	},
	birthday: { type: Date },
	password: {
		type: String,
		required: true,
	},
});
signupSchema.methods.generateAuthToken = async function () {
	try {
		const token = jwt.sign(
			{ _id: this._id },
			'mynameisdilkashshaikhmahajan',
		);
		return token;
	} catch (error) {
		console.log(error);
	}
};

// signupSchema.pre('save', async function (next) {
// 	if (this.isModified('password')) {
// 		this.password = await bcrypt.hash(this.password, 10);
// 	}

// 	next();
// });

module.exports = mongoose.model('register', signupSchema);
