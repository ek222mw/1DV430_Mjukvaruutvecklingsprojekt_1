/* jshint esversion:6*/
let session  = require('express-session');
let bodyParser = require('body-parser');
let exphbs = require('express-handlebars');
let path = require('path');
let express = require('express');

let fsp = require('fs-promise');
let csrf = require('csurf');
let helmet = require('helmet');
require('dotenv').config();
let app = express();
let fs = require('fs');
let port = process.env.PORT || 3000;
let exUpload = require("express-fileupload");

//use express upload
app.use(exUpload());
//start database
require("./libs/helper").initialize();
//use filetype hbs as view engine.
app.engine(".hbs", exphbs({
  defaultLayout: "main",
  extname: ".hbs"
}));
app.set("view engine", ".hbs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//use for localhost
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('public/images'));

//from: https://github.com/1dv023/syllabus/blob/master/lectures/03/demo/server.js , init session and cookie settings
app.use(session({
  name:   "sessionforserver",
  secret: process.env.secret_session, // hide this variabel later
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 2000 * 60 * 60 * 24 // lives in 2 days
  }
}));
//if not testing use csrf.
if(process.env.Test !== "Test")
{
  app.use(csrf());
  app.use(function (req, res, next) {
    res.locals.csrftoken = req.csrfToken();
    next();
  });
  // csrf error handler
  app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN')
    {
      return next(err);
    }

    // taking care of CSRF token errors here
    res.status(403).render("error/403csrf");
  });
}
//http headers protection.
app.use(helmet());
//set flash and login local variables as session status.
app.use(function(req, res, next) {

  if(req.session.flash) {
    res.locals.flash = req.session.flash;

    delete req.session.flash;
  }
  //checking if session object loggedin is set and then user is logged in.
  if(req.session.loggedin)
  {
    res.locals.loggedin = req.session.loggedin;
  }
  //moving on to next middleware.
  next();
});



//routes
app.use("/", require("./routes/home.js"));
app.use("/users", require("./routes/users.js"));
app.use("/genres", require("./routes/genres.js"));
app.use("/genres/bands", require("./routes/bands.js"));
app.use("/genres/bands/albums", require("./routes/albums.js"));
app.use("/genres/bands/albums/ratings", require("./routes/ratings.js"));
app.use("/slack", require("./routes/slack.js"));

//handles 404 errors.
app.use(function(req, res, next) {


  res.status(404).render("error/404");
});

//handles error 500 errors
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).render("error/500");
});


//setup server to listen to port number
var server = app.listen(port, function() {
  console.log('Listening on port %d',port);
});



module.exports = server;
