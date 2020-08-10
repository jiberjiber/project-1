// Add Dependencies and Required Consts
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
//changed bottom from require('./models/index')
const db = require('./models/index');
const authMiddleware = require('./middleware/auth-middleware');
const cors = require('cors');
const { userController, petController } = require('./controllers');
const clientDir = path.join(__dirname, '../client');


// Express App Setup
const app = express();
const PORT = process.env.PORT || 8080;

// Socket.io Setup
const http = require('http').createServer(app);
const io = require('socket.io')(http);


// Express JSON Middleware Setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static File Serve Setup
app.use(express.static(clientDir));

// Pug Engine Setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine','pug');

// Express Cookie Middleware Setup
app.use(cookieParser());

// Custom Middleware Setup
app.use(authMiddleware);

// Custom Routing
app.use('/user', userController);
app.use('/pets', petController);

// CORS Setup
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//
// Routes
//
app.get('/', function(req, res){
	if(!req.user){
		res.render('login');
	} else{
		res.redirect('/home');
	}
});

// Home page
app.get('/home', async (req, res) => {

	let username = req.user.username;

	let allUsers = await db.User.findAll();

	
	
	if(req.user){
		if(req.pets.length == 0){
			res.render('petAdd',{
				welcomeMessage: `Hi ${username}!`,
				pageMsg: "Looks like you dont have any pets on your account yet, let's add some!"
			});
		} else {
			res.render('home', { 
				pets: req.pets,
				allUsers: allUsers,
				username: username,
				numPets: req.user.numPets
			});
		}
	} else {
		res.render('error');
	}
	
});


app.get('/social', (req, res)=>{
	if(!req.user){
		res.render('error')
	} else {
		res.render('social');
	}
});

// let myProfile;
// module.exports={myProfile}
app.get('/profile/:id', async (req, res)=>{
    if(!req.user){
		res.render('error');
	} else {
		const targetUser = await db.User.findOne({
			where: {
				id: req.params.id
			}
		});
		
		const targetUserPets = await db.Pet.findAll({
			where: {
				UserId: targetUser.id
			}
		});
		
		res.render('profile', {
			user: targetUser,
			pets: targetUserPets,
			numPets: req.user.numPets,
			username: req.user.username
		});
	}
});


//6-day weather forecast
app.get('/weather', function(req, res){
	let allUsers = db.User.findAll();
	let username = req.user.username;

	
	if(!req.user){
		res.render('login');
	} else{
		res.render('weather', { 
			pets: req.pets,
			allUsers: allUsers,
			username: username
		});
	}
});

// Register page
app.get('/register', function(req, res){
	if(!req.user){
		res.render('register');
	} else {
		res.redirect('/home');
	}
});

// Socket Route
app.get('/sms', async (req, res) => {
	// let allUsers = db.User.findAll();
	// let username = req.user.username;
	res.sendFile(path.join(clientDir, '../client/assets/index.html'))
	
	// res.render('test.pug', { 
	
	// })
});

// Server Init
db.sequelize.sync({force:false}).then(() => {
	http.listen(PORT, function () {
		console.log("App now listening at localhost:" + PORT);
	});
});

//added bottom
//calling socket.js imported file and route
require("./controllers/msg-controller")(app)
require("./socket")(io);
