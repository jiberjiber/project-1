// Add Dependencies and Required Consts
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
//changed bottom from require('./models/index')
const db = require('./models/index');
const authMiddleware = require('./middleware/auth-middleware');
const cors = require('cors');
const { userController, petController } = require('./controllers');
const { sequelize } = require('./models/index');
const clientDir = path.join(__dirname, '../client');
const { Op } = require('sequelize');
const controllers = require('./controllers');

// Express App Setup
const app = express();
const PORT = process.env.PORT || 8080;

// Socket.io Setup
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// Express JSON Middleware Setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static File Serve Setup
app.use(express.static(clientDir));

// Pug Engine Setup
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "pug");

// Express Cookie Middleware Setup
app.use(cookieParser());

// Custom Middleware Setup
app.use(authMiddleware);

// Custom Routing
app.use("/user", userController);
app.use("/pets", petController);

// CORS Setup
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//
// Routes
//
app.get("/", function (req, res) {
  if (!req.user) {
    res.render("login");
  } else {
    res.redirect("/home");
  }
});

// Home page
app.get("/home", async (req, res) => {
  let username = req.user.username;
  let thisID = req.user.id;
  let profileImg = req.user.link;
  let userID = req.user.id; //passig user ID in a variable regognized by nav link

  let allUsers = await db.User.findAll({
    where: {
      id: {
        [Op.ne]: thisID,
      },
    },
  });

  if (req.user) {
    if (req.pets.length == 0) {
      res.render("petAdd", {
        welcomeMessage: `Hi ${username}!`,
        pageMsg:
          "Looks like you dont have any pets on your account yet, let's add some!",
      });
    } else {
      res.render("home", {
        pets: req.pets,
        allUsers: allUsers,
        user: req.user,
        numPets: req.user.numPets,
        profileImg: profileImg,
        thisID: thisID,
        userID: userID,
      });
      console.log("targetUserImg", req.params);
    }
  } else {
    res.render("error");
  }
});

app.get("/search", (req, res) => {
  let allUsers = db.User.findAll();
  let username = req.user.username;
  let userID = req.user.id;
  let profileImg = req.user.link;

  if (!req.user) {
    res.render("login");
  } else {
    res.render("search", {
      pets: req.pets,
      allUsers: allUsers,
      username: username,
      userID: userID,
      profileImg: profileImg,
      user: req.user,
    });
  }
});

// let myProfile;
// module.exports={myProfile}
app.get("/profile/:id", async (req, res) => {
  let userID = req.user.id;
  let profileImg = req.user.link;
  let targetUserID = req.params.id;

  // let newUserID = targetUser.id;

  if (!req.user) {
    res.render("error");
  } 
  else {
    const targetUser = await db.User.findOne({
      where: {
        id: req.params.id,
      },
    });

    const targetUserPets = await db.Pet.findAll({
      where: {
        UserId: targetUser.id,
      },
    });

    res.render("profile", {
      user: targetUser,
      pets: targetUserPets,
      numPets: req.user.numPets,
      username: req.user.username,
      userID: userID,
      profileImg: profileImg,
      targetUserID: targetUserID,
    });
  }
});

// Register page
app.get("/register", function (req, res) {
  if (!req.user) {
    res.render("register");
  } else {
    res.redirect("/home");
  }
});

//6-day weather forecast
app.get("/weather", function (req, res) {
  let allUsers = db.User.findAll();
  let thisID = req.user.id;
  let username = req.user.username;
  let userID = req.user.id;
  let targetUserID = req.params.id;


  if (!req.user) {
    res.render("login");
  } else {
    res.render("weather", {
      pets: req.pets,
      allUsers: allUsers,
      username: username,
      userID: userID,
      user: req.user,
      numPets: req.user.numPets,
      targetUserID: targetUserID,
      thisID: thisID,

    });
  }
});

// Socket Route
app.get("/sms", async (req, res) => {
  // let allUsers = db.User.findAll();
  // let username = req.user.username;
  res.sendFile(path.join(clientDir, "../client/assets/index.html"));

  // res.render('test.pug', {

  // })
});

// Calendar route
app.get("/calendar", async (req, res) => {
  if (!req.user) {
    res.redirect("/");
  } else {
    res.render("planner");
  }
});

// Server Init
db.sequelize.sync().then(() => {
  http.listen(PORT, function () {
    console.log("App now listening at localhost:" + PORT);
  });
});

//added bottom
//calling socket.js imported file and route
require("./controllers/msg-controller")(app);
require("./socket")(io);
