const {check, validationResult} = require('express-validator');


exports.valRes = (req, res, next) => {
	const result = validationResult(req).array();
	if(!result.length) return next();

	const msg = result[0].msg;
	res.json({error: true, msg: msg, code:'202'});
}

exports.valSignUp = [
	check('name')
		.trim()
		.not().isEmpty().withMessage('Name Require'),

	check('email')
		.trim()
		.not().isEmpty().withMessage('Email Require')
		.normalizeEmail().isEmail().withMessage('Enter a valid Email'),

	check('pwd').trim()
		.not().isEmpty().withMessage('Password Require')
		.isLength({min:8,max:20}).withMessage('Password must be within 8 to 20 characters!')
];

exports.valSignIn = [
	check('email').trim()
		.not().isEmpty().withMessage('Email Require')
		.normalizeEmail().isEmail().withMessage('Enter a valid Email'),
	check('pwd').trim()
		.not().isEmpty().withMessage('Password Require')
		.isLength({min:8,max:20}).withMessage('Password must be within 8 to 20 characters!')
];
exports.valPass =[
	check('pwd').trim()
		.not().isEmpty().withMessage('Password Require')
		.isLength({min:8,max:20}).withMessage('Password must be within 8 to 20 characters!')
]