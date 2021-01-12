//express js
const { urlencoded } = require('express');
const bcrypt = require('bcryptjs');
const express = require('express');
const app = express();
const swal = require('sweetalert');

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const { check, validationResult } = require('express-validator');
const cookieparser = require('cookie-parser');
const auth = require('./middleware/auth');
// Register model code
const DilkashFormUp = require('./src/model');

//connection code
require('./src/db');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//cookie parser
app.use(cookieparser());

//port number
port = process.env.PORT || 3200;

//MiddleWares
app.use(express.static('public'));

//Set view Engines
app.set('view engine', 'ejs');

//Home Routes
app.get('/', (req, res) => {
	res.render('home', { isPage: false, isLogin: false });
});

//Login route
app.get('/login', (req, res) => {
	res.render('login');
});
//login form post route
// here auth function is define for generating jwt token and authenticated the user
app.post(
	'/login',
	urlencodedParser,
	[
		check('email', 'email must be contain').isEmail(),
		check(
			'password',
			'password must contain 8 character with number.',
		).isLength({ min: 8 }),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			const alert = errors.array();
			if (!errors.isEmpty()) {
				console.log(`error array is not empty`);
				res.status(403).render('login', { alert });
			} else {
				const email = req.body.email;
				const password = req.body.password;
				const userEmail = await DilkashFormUp.findOne({ email: email });
				const isMatch = await bcrypt.compare(
					password,
					userEmail.password,
				);

				//generate jwt token for verifying user is login or not
				const token = await userEmail.generateAuthToken();
				//jwt token is store into cookies
				res.cookie('jwttoken', token, {
					httpOnly: true,
					expires: new Date(new Date().getTime() + 5 * 60 * 1000),
				});

				if (isMatch) {
					res.status(201).render('home', {
						isPage: true,
						isLogin: true,
					});
				} else {
					res.status(403).render('login');
				}
			}
			// try start
			//  try end here
		} catch (err) {
			res.status(403).render('login');
		}
	},
);

//Signup Password Route
app.get('/signup', (req, res) => {
	res.render('signup');
});
//Forgot Password Form Post Route
app.post(
	'/forgot',
	urlencodedParser,
	[
		check('email', 'email must be contain').isEmail(),
		check(
			'password',
			'password must contain 8 character with number.',
		).isLength({ min: 8 }),
		check(
			'UpdateCurrentPassword',
			'New Password must contain 8 character with number.',
		).isLength({ min: 8 }),
		check(
			'UpdateReTypeCurrentPassword',
			'ReType New Password must contain 8 character with number.',
		).isLength({ min: 8 }),
	],
	async (req, res) => {
		try {
			//try start here
			const errors = validationResult(req);
			const alert = errors.array();
			if (!errors.isEmpty()) {
				console.log(`error array is not empty`);
				res.status(403).render('forgot', { alert });
			} else {
				const userName = req.body.userName;
				const password = req.body.password;
				const UpdateCurrentPassword = req.body.UpdateCurrentPassword;
				const UpdateReTypeCurrentPassword =
					req.body.UpdateReTypeCurrentPassword;

				if (UpdateCurrentPassword === UpdateReTypeCurrentPassword) {
					const currentPassword = await bcrypt.hash(
						UpdateCurrentPassword,
						10,
					);
					const userEmail = await DilkashFormUp.findOne({ userName });
					const isMatch = await bcrypt.compare(
						password,
						userEmail.password,
					);

					if (isMatch) {
						const updatePassword = await DilkashFormUp.updateOne({
							password: currentPassword,
						});

						res.render('login');
					} else {
						res.status(400).send('invalid Credential ');
					}
				} else {
					console.log("pasword don't match");
				}
			}
			//try end here
		} catch (err) {
			console.log(err);
		}
	},
);
//Logout Route
app.get('/logOut', auth, async (req, res) => {
	try {
		res.clearCookie('jwttoken');
		res.render('login', { isLogin: false });
	} catch (error) {
		console.log(error);
	}
});

//Signup Form Post Route
app.post(
	'/signup',
	urlencodedParser,
	[
		check('fullName', 'Full Name must be contain 15 Characters').isLength({
			min: 15,
		}),
		check(
			'userName',
			'userName must be at least 8 Character with Number',
		).isLength({ min: 8 }),
		check('email', 'email must be contain').isEmail(),
		check('mobile', 'Mobile Number Only Contain 10 Number').isLength({
			min: 10,
			max: 10,
		}),
		check(
			'password',
			'password must contain 8 character with number.',
		).isLength({ min: 8 }),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			const alert = errors.array();
			if (!errors.isEmpty()) {
				res.status(403).render('signup', { alert });
			} else {
				const registerData = new DilkashFormUp({
					fullName: req.body.fullName,
					userName: req.body.userName,
					email: req.body.email,
					mobile: req.body.mobile,
					birthday: req.body.birthday,
					password: await bcrypt.hash(req.body.password, 10),
				});
				// const userRegister = new DilkashFormUp(req.body);
				const registerd = await registerData.save();
				res.status(201).render('login');
			}
		} catch (err) {
			console.log(err);
			res.status(400).send('error, user not created');
		}
	},
);

//Forget Password Route
app.get('/forgot', (req, res) => {
	res.render('forgot');
});

//Receipe route
app.get('/receipes', auth, (req, res) => {
	// get the user cookie
	res.render('receipes', { isLogin: true });
});
// urlencodedPaeser;

//server listen code
app.listen(port, () => {
	console.log(`Server started on ${port} port`);
});
