const jwt = require('jsonwebtoken');
const Skill = require('../database/models/skills');
const User = require('../database/models/user');

exports.getUsers = async(req, res) => {
	const u = await User.find().select('name email dp');
	res.send(u);
}

exports.getUsers = async(req, res) => {
	const skills = req.body.skills.toLowerCase();
	const arrSkill = skills.split(",");
	// $setIntersection (aggregation)
	// const u = await Skill.find({"name" : {"$in" : arrSkill}});
	
	// const u = await Skill.aggregate([
	//    {$match:{"name" : {"$in" : arrSkill}}},
	//    {$group:{_id:null, first:{$first:"$users.id"}, second:{$last:"$users.id"}}},
	//    {$project: {userIds: {$setIntersection: ["$first", "$second"]}, _id: 0 } }
	// ]);
	let a = {};
	a = await Skill.aggregate([
	   {$match:{"name" : {"$in" : arrSkill}}},
	   {$group:{_id:null, first:{$first:"$users.id"}, second:{$last:"$users.id"}}},
	   {$project: {uIds: {$setIntersection: ["$first", "$second"]}, _id: 0 } }//,
	   // {$lookup: {from:"users",localField:"uIds",foreignField:"_id",as:"user_doc"}}
	]);

	// res.send(typeof a);

	const size = 0

	if(!a[0]){
		res.json({empty:true, users: 'We found 0 rows'});
	}
	else{
		// res.send(a[0].uIds);
		const uids = a[0].uIds;

		const u = await User.find({"_id" : {"$in" : uids}})
		.select('name email dp')
		.populate({path:"skills.id", select:"name"});

		res.json({empty:false, users: u});
		
	}

	// try {
	//   if(Object.keys(a).length === 0){
	//   	size = Object.keys(a).length;
	// 		res.send(size);
	//   }
	//   else{
	//   	res.send(typeof a);
	//   }
	// }
	// catch(err) {
	// 	console.log("error detected");
	// 	res.send(typeof a);
	// }




	//res.send(a[0].uIds);
	// const uids = a[0].uIds;

	//const u = await User.find({"_id" : {"$in" : uids}})
	//.select('name email dp')
	//.populate({path:"skills.id", select:"name"});

	//res.send(u);


}
