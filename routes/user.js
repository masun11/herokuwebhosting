const express = require('express');

const router = express.Router();

const {getUsers, createUser, signInUser, getLogUser, getUser, upUserDetail, upUserPass, addSkill, deleteSkill} = require('../controllers/userController');
const {valSignUp, valSignIn, valPass, valRes, } = require('../middlewares/validation/user');
const {isAuth} = require('../middlewares/auth');


router.get('/user', getUsers); // user list
router.post('/user/sign-up', valSignUp, valRes, createUser);
router.post('/user/sign-in', valSignIn, valRes, signInUser);
// router.delete('/user/:userId', deleteUser); // user delete

router.get('/user/loguser', isAuth, getLogUser);
router.post('/user/details', isAuth, getUser);
router.post('/user/updetails', isAuth, upUserDetail); // detail update
router.post('/user/uppass', valPass, valRes, isAuth, upUserPass); // password update

router.post('/user/skill', isAuth, addSkill); // create
router.delete('/user/skill/:skillid', isAuth, deleteSkill); // create


module.exports = router;