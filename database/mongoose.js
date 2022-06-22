const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('Database Connected'))
.catch((error)=>console.log(error));

// module.exports = mongoose;