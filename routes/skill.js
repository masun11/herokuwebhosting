const express = require('express');

const router = express.Router();

const {getUsers} = require('../controllers/skillController');
const {isAuth} = require('../middlewares/auth');


router.post('/skills/users', isAuth, getUsers); // user list

module.exports = router;