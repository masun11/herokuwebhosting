const jwt = require('jsonwebtoken');
const User = require('../database/models/user');

exports.isAuth = async (req, res, next) => {
	// console.log(req.headers.ican);
	if(req.headers && req.headers.ican){
		const token = req.headers.ican.split(' ')[1];
		try{
			const decode = jwt.verify(token, process.env.JWT_SECRET);
			const user = await User.findById(decode.userId);
			if(!user){
				return  res.json({error:true, msg: 'unauthorized access!'});
			}
			req.user = user;
			next();
		}catch (error){
			if(error.name === 'JsonWebTokenError'){
				return  res.json({error:true, msg: 'unauthorized access!'});
			}
			if(error.name === 'JsonExpired Error'){
				return  res.json({error:true, msg: 'Session expired!'});
			}
			res.json({error:true, msg: 'Internal server error!'});
		}

	}else{
		res.json({error:true, msg: 'unauthorized access!'});
	}
}