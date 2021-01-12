const mongoose = require('mongoose');
const signinschema = mongoose.Schema({
	userName: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
});
module.exports = mongoose.model('Login', signinschema);
