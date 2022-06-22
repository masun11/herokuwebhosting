const mongoose = require('mongoose');

const SkillsSchema = new mongoose.Schema({
 	name:{
 		type: String,
 		require: true
 	},
 	users:[{
 		id:{
	 		type: mongoose.Types.ObjectId,
	 		ref: "users"
	 	}
 	}]
});

SkillsSchema.statics.isUserListed = async function(uid, sid){
	if(!uid || !sid) throw new Error('Invalid Date');
	try{
		const s = await this.findOne({"_id":sid, "users": { $elemMatch: { "id": uid } } });
		if(s) return true;
		return false;
	}catch(error){
		console.log('error inside isUserListed method',error.message);
		return false;
	}
}

module.exports = mongoose.model('skills', SkillsSchema);
