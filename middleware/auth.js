const jwt = require('jsonwebtoken');

// jwt.verify
const auth = async (req, res, next) => {
	try {
		const token = req.cookies.jwttoken;
		const verifyUser = jwt.verify(token, 'mynameisdilkashshaikhmahajan');
		next();
	} catch (error) {
		res.render('login');
	}
};
module.exports = auth;
