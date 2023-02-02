//mongo related variables
//INTESTMODE
const YOUR_DOMAIN = "";
const bcrypt = require("bcrypt")
const multer = require("multer")
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./files/images");
  },
  filename: (req, file, cb) => {
    cb(null, "temp.jpg");
  },
});
const { MongoClient } = require('mongodb');
ObjectId = require('mongodb').ObjectId
const uri = ""/*MONGO DATABASE URI*/;
var database;

//epress middleware imports
var cookieParser = require('cookie-parser');
var sessions = require("express-session");
var passport = require('passport');
var LocalStrategy = require('passport-local');

//basic express
const { createServer } = require("http");
const express = require('express');
const app = express();
const httpServer = createServer(app);
const port = 5000;

//websockets
const { Server } = require("socket.io");
const io = new Server(httpServer, { /* options */ });

//passport local strategy and serialization
passport.use(new LocalStrategy(function verify(username, password, cb) {
  console.log("passport");
  database.collection("users").findOne({ "email": username }, (err, result) => {
    console.log(result)
    if (err) { return cb(err); }
    if (!result) { return cb(null, false, { message: 'Incorrect username or password.' }); }
    bcrypt.compare(password, result.password, function(err, check) {
      if (err) { return cb("theres an error", err) }
      console.log("-------")
      console.log(result)
      if (check == true) {
        return cb(null, result)
      }
      console.log("bad input")
      return cb(null, false, { message: 'Incorrect username or password.' })
    });


  })
}));
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, user);
  });
});
passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

//middleware applications
app.use('/files', express.static('files'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(sessions({ secret: 'blakwfealkjsnfo7hf4fhaw', resave: false, saveUninitialized: true, cookie: { maxAge: /*30 days*/30 * 1000 * 60 * 60 * 24 }, }))
app.use(cookieParser())
app.use(passport.authenticate('session'));


//post routes
app.post('/manage-login', passport.authenticate('local'), (req, res) => {
  return res.end("success")
});

app.post('/create', (req, res) => {
  console.log("beggining data")
  console.log(req.body)
  if (req.body.password != req.body.cpassword) {
    return res.status(400).send("Passwords do not match")
  }
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
    return res.status(400).send("Improper email")
  }
  if (req.body.password.length < 8 || !/[A-Z]/.test(req.body.password) || !/[0-9]/.test(req.body.password)) {
    console.log("bad password")
    res.locals.error = "Password must contain atleast 8 characters, include one uppercase letter, and one number"
    return res.status(400).send(res.locals.error)
  }
  console.log("data good")
  database.collection("users").findOne({ "email": req.body.email }, (err, result) => {
    if (err) { return serverError(err, req, res, "/create") }
    if (result) {
      res.locals.error = "Email already in use"
      return res.status(400).send(res.locals.error)
    }
    bcrypt.hash(req.body.password, 10, function(err, hashedPassword) {
      if (err) { return serverError(err, req, res, "/create") }
      database.collection("users").insertOne({ "email": req.body.email, "password": hashedPassword }, function(err, result) {
        if (err) { return serverError(err, req, res, "/create") }
        req.login({ "email": req.body.email }, function(err) {
          if (err) { return serverError(err, req, res, "/create") }
          return res.end("success");
        });
      });
    });
  })


});

app.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.post('/creategroup', function(req, res) {
  req.body.longbox = req.body["longbox[]"]
  req.body.latbox = req.body["latbox[]"]
  ndlats = Number(req.body.latbox[0])
  ndlate = Number(req.body.latbox[1])
  ndlongs = Number(req.body.longbox[0])
  ndlonge = Number(req.body.longbox[1])
  ndlong = Number(req.body.long)
  ndlat = Number(req.body.lat)
  finalq = {
    $or: [
      {
        "lats": { $gte: ndlats, $lte: ndlate },
        "longs": { $gte: ndlongs, $lte: ndlonge }
      }
      ,
      {
        "lats": { $gte: ndlats, $lte: ndlate },
        "longe": { $gte: ndlongs, $lte: ndlonge }
      }
      ,
      {
        "late": { $gte: ndlats, $lte: ndlate },
        "longs": { $gte: ndlongs, $lte: ndlonge }
      }
      ,
      {
        "late": { $gte: ndlats, $lte: ndlate },
        "longe": { $gte: ndlongs, $lte: ndlonge }
      }
      ,
      {
        "lats": { $lte: ndlat },
        "late": { $gte: ndlat },
        "longs": { $lte: ndlong },
        "longe": { $gte: ndlong }
      }
    ]
  }
  finala = {
    "radius": Number(req.body.radius),
    "messages": [],
    "lat": ndlat,
    "long": ndlong,
    "name": req.body.groupname,
    "lats": Number(ndlats),
    "late": Number(ndlate),
    "longs": Number(ndlongs),
    "longe": Number(ndlonge),
  }
  database.collection("chats").findOne(finalq, (err, result) => {
    if (err) {
      console.log("error 1")
      return res.status(400).send("Error on databases")
    }
    if (result) {
      console.log(result)
      return res.status(400).send("result found for new chat")
    }
    database.collection("chats").insertOne(finala, function(err, result) {
      if (err) {
        return res.status(400).send("Error on entry")
      }
      res.cookie('user', req.query.name, { maxAge: 900000 });
      res.cookie('cid', String(result._id), { maxAge: 900000 });
      console.log(String(result.insertedId))
      return res.end(String(result.insertedId))
    });
  })
});




//get routes for pages
app.get("/joingroupapi", (req, res) => {
  console.log("sum")
  var ndlat = Number(req.query.lat)
  var ndlong = Number(req.query.long)
  console.log(ndlat, ndlong)
  var finalq = {
    "lats": { $lte: ndlat },
    "late": { $gte: ndlat },
    "longs": { $lte: ndlong },
    "longe": { $gte: ndlong }
  }
  database.collection("chats").findOne(finalq, (err, result) => {
    if (err) {
      console.log("error 1")
      return res.status(400).send("Error on databases query")
    }
    else if (result) {
      console.log(result)
      if (req.query.name != undefined) {
        result.pname = req.query.name
        res.cookie('user', req.query.name, { maxAge: 900000 });
        res.cookie('cid', String(result._id), { maxAge: 900000 });
      }
      else {
        result.pname = req.cookies.user
      }
      result._id = String(result._id)
      console.log(result)
      res.end(JSON.stringify(result))

    }
    else {
      console.log("no results")
      return res.status(400).send("No results found")
    }

  })
})

app.get('/', (req, res) => {
  res.sendFile('main.html', { root: __dirname + "/files/html" });
})

app.get('/chat', (req, res) => {
  if (req.cookies.cid) {
    return res.sendFile('chat.html', { root: __dirname + "/files/html" });
  }
  else {
    res.redirect("/")
  }
})

app.get('/*', (req, res) => {
  return res.status(404).send("Not found")
});



//WEBSOCKETS--------------------
io.on("connection", (socket) => {
  socket.on("message", (data) => {
    final = { message: data.message, name: data.name }
    database.collection("chats").updateOne({ _id: ObjectId(data.cid) }, { $push: { messages: final } }, (err, result) => {
      if (err) {
        console.log("totaled")
        return res.status(404).send("db error")
      }
      else {
        console.log("oofer gang")
        console.log("shes in love with who i am", data)
        io.emit(data.cid, { message: data.message, name: data.name })
      }
    })
  });
});

//initialize mongo and start server
MongoClient.connect(uri, function(err, client) {
  if (err) {
    console.log(err);
    return
  }
  database = client.db("weconnect")
  httpServer.listen(port, (err) => {
    if (err) {
      console.log("there was an error")
      console.log(err);
      return;
    }
    console.log(`Now listening on port ${port}`);
  });
});