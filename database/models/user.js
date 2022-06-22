const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
 	name:{
 		type: String,
 		require: true
 	},
 	email:{
 		type: String,
 		require: true,
 		unique: true
 	},
 	pwd:{
 		type: String,
 		require: true
 	},
 	dp:{
 		type: String,
 	},
 	skills:[{
 		id:{
	 		type: mongoose.Types.ObjectId,
	 		ref: "skills"
	 	}
 	}]
});

UserSchema.pre('save', function(next){
	if(this.isModified('pwd')){
		bcrypt.hash(this.pwd, 8, (err, hash) => {
			if(err) return next(err);
			this.pwd = hash;
			next();
		});
	}
});

UserSchema.statics.generatePass = async function(pwd){
	return new Promise((resolve, reject) => {
      bcrypt.genSalt(8, (genSaltErr, salt) => {
        if (genSaltErr) return reject(genSaltErr);
        bcrypt.hash(pwd, salt, (hashErr, hash) => {
          if (hashErr) return reject(hashErr);
          resolve(hash);
        });
      });
    });
}

UserSchema.statics.isThisEmailInUse = async function(email){
	if(!email) throw new Error('Invalid Email');
	try{
		const user = await this.findOne({email});
		if(user) return false;
		return true;
	}catch(error){
		console.log('error inside isThisEmailInUse method',error.message);
		return false;
	}
}

UserSchema.methods.comparePassword =  async (password, hash) => {
	if(!password) throw new Error('Password is missing, can not compare!');
	try{
		const result = await bcrypt.compare(password, hash);
		return result;
	} catch (error) {
		console.log('Error while comparing password! ', error.message);
	}
}

UserSchema.statics.isSkillListed = async function(uid, sid){
	if(!uid || !sid) throw new Error('Invalid Date');
	try{
		const u = await this.findOne({"_id":uid, "skills": { $elemMatch: { "id": sid } } });
		if(u) return true;
		return false;
	}catch(error){
		console.log('error inside isSkillListed method',error.message);
		return false;
	}
}

 module.exports = mongoose.model('users', UserSchema);
