const jwt = require('jsonwebtoken');
const User = require('../database/models/user');
const Skill = require('../database/models/skills');

exports.getUsers = async(req, res) => {
	const u = await User.find().select('name email dp');
	res.send(u);
}

exports.createUser = async(req, res) => {
	const isNewUser = await User.isThisEmailInUse(req.body.email);
	if(!isNewUser){
		return res.json({
			error: true,
			msg: 'This email is already in use, try sign-in',
			code: '201'
		});
	}
	const user = await User({
		name: req.body.name, 
		email: req.body.email, 
		pwd: req.body.pwd 
	});
	await user.save();
	const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET,{expiresIn: '1d'});
	return res.json({error: false, msg: 'login success', code: '200', token});
	// res.json(user);
}


exports.signInUser = async (req, res) => {
	const {email, pwd } = req.body;
	const user = await User.findOne({email:email});
	if(!user){ return res.json({error: true, msg: 'wrong Email and password'});}
	const result = await user.comparePassword(pwd,user.pwd);
	if(!result){ return res.json({error: true, msg: 'wrong Email and password'});}

	const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET,{expiresIn: '1d'});
	return res.json({error: false, msg: 'login success', token});
}

exports.getLogUser = async(req, res) => {
	const {user } = req;
	const u = await User.findOne()
	.where({"_id":user._id})
	.populate({path:"skills.id", select:"name"})
	.select('-pwd');
	res.send(u);
}


exports.getUser = async(req, res) => {
	const {user } = req;
	try{
		const u = await User.findById(req.body.userId)
		.populate({path:"skills.id", select:"name"})
		.select('-pwd');
		res.json({"user":u,"error":false});
	}
	catch(err){
		res.json({"msg":'User not found.',"error":true});
	}
}

exports.upUserDetail = async(req, res) => {
	const {user } = req;
	const newProfile = {};
	if(req.body.name) newProfile['name'] = req.body.name;
	if(req.body.dp) newProfile['dp'] = req.body.dp;
	if(req.body.email){
		const isNewUser = await User.isThisEmailInUse(req.body.email);
		if(!isNewUser){
			return res.json({
				error: true,
				msg: 'This email is already in use, try sign-in',
				code: '201'
			});
		}
		newProfile['email'] = req.body.email
	};
	await User.updateOne({ "_id": user._id }, { $set: newProfile})
	.then((list)=>res.send({'error':false}))
	.catch( (error)=>res.send({'error':true}) );
}


exports.upUserPass = async(req, res) => {
	const {user } = req;
	// const isNewUser = await User.isThisEmailInUse(req.body.email);
	const gp = await User.generatePass(req.body.pwd);
	const newProfile = {pwd: gp};
	await User.updateOne({ "_id": user._id }, { $set: newProfile})
	.then((list)=>res.send({'error':false}))
	.catch( (error)=>res.send({'error':true}) );
}


exports.addSkill = async(req, res) => {

	const {user } = req;

	// const _proid = req.body._proId;
	let rowData = req.body.name;
	const name = rowData.toLowerCase();
	var proId = '';

	const hasSkill = await Skill.findOne({name});
	// console.log(hasSkill);
	if(hasSkill){
		// console.log(hasSkill._id);
		//const SkillListed = await Skill.findOne({name});
		const isSkillListed = await User.isSkillListed(user._id, hasSkill._id);
		const isUserListed = await Skill.isUserListed(user._id, hasSkill._id);
		if(isSkillListed && isUserListed){
			return res.json({
				error: true,
				msg: 'Skill was already listed',
				code: '201'
			});
		}
		else if(!isSkillListed && !isUserListed){
			await User.updateOne({ "_id": user._id }, { $push: { "skills": { "id":hasSkill._id }}});
			await Skill.updateOne({ "_id": hasSkill._id }, { $push: { "users": { "id":user._id }}});
			res.send({'error':false});
		}
		else if(!isSkillListed){
			await User.updateOne({ "_id": user._id }, { $push: { "skills": { "id":hasSkill._id }}});
			res.send({'error':false});
		}
		else if(!isUserListed){
			await Skill.updateOne({ "_id": hasSkill._id }, { $push: { "users": { "id":user._id }}});
			res.send({'error':false});
		}
		else{
			res.send({'error':true, 'msg': 'all codition was check, Internal Error'});
		}
	}
	else{
		const skill = Skill({name, users:[{id:user._id}] });
		await skill.save()
		.then( async(p)=> {
				await User.updateOne({ "_id": user._id }, { $push: { "skills": { "id": p._id }}})
				.then((list)=>res.send({'error':false}))
				.catch( (error)=>res.send({'error':true}) );
		}).catch( (error)=>res.send({'error':true}) );
	}
	
}



exports.deleteSkill = async(req, res) => {
	const {user } = req;

	const sid = req.params.skillid;
	
	await Skill.updateOne({"_id": sid},{$pull:{"users":{"id": user._id}}})
	await User.updateOne({"_id": user._id},{$pull:{"skills":{"id": sid}}});
	res.send({'error':false});


	// setTimeout(async function() {
	// 	await Skill.updateOne({"_id": sid},{$pull:{"users":{"id": user._id}}})
	// 	await User.updateOne({"_id": user._id},{$pull:{"skills":{"id": sid}}});
	// 	res.send({'error':false,'msg':'12345'});  
	// }, 10000);


}