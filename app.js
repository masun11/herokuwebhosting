const express = require('express');
require('dotenv').config();
const app = express();
require('dotenv').config();
const mongoose = require('./database/mongoose');
const userRouter = require('./routes/user');
const skillRouter = require('./routes/skill');
const port = process.env.PORT || 3000;

app.use(express.json());

/*
	CORS - Cross Origin Request Security
	localhost:3000 - backend api
	localhost:4200 - front-end
*/
app.use((req, res, next) =>{
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Methods','GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE');
	res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Ican');
	next();
});

app.get('/', (req, res) => {
  res.send('welcome')
});

app.use(userRouter); // user
app.use(skillRouter); // skill

app.listen(port, () => console.log("Server Connect on port 3000"));
