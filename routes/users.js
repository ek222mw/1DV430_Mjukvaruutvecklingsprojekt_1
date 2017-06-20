/*jshint esversion: 6 */
var User = require("../models/User");
let router = require("express").Router();
let xss = require('xss');

//setting up route for get and post for login user
router.route("/login")
  .get(function(req, res) {

      if(req.session.loggedin) //If already login then send err mess to view.
      {
          res.render("home/index", {error:"Already logged in"});
      }
      else{
          res.render("home/index");
      }

    }).post(function(req, res) {
      //xss filter inputs.
      let usrname = xss(req.body.username);
      let passwrd = xss(req.body.password);

    //validating fields.
    if(usrname.length < 1 || passwrd.length < 1)
    {
       res.render("home/index", {error: "No input on username or password."});

    }
    else
    {
      //searching for user
      User.find({username:usrname}, function(error, data) {
        //check if username exists.
        if(data.length === 1)
        {
          User.findOne({ username: usrname }, function(err, user) {
            if (err)
            {
              throw err;

            }
            // compares passwords
            user.comparePassword(passwrd, function(err, isMatch) {
                if (err)
                {
                   throw err;
                }
                else
                { //check if no match with password output error message
                  if(!isMatch)
                  {
                    res.render("home/index", {error: "Wrong username or password."});
                  }
                  else
                  { //successful login. set objects in session.
                    if(user.admin)
                    {
                      req.session.admin = true;
                    }
                    req.session.username = usrname;
                    req.session.loggedin = true;
                    req.session.flash = {
                      type: "succesful",
                      message: "Login successful"
                    };
                       res.redirect('../genres');
                  }
               }
            });

          });
        }
        else
        {
          res.render("home/index", {error: "Wrong username or password."});
        }

      });
  }


});

//route to logout.
router.route("/logout")
  .post(function(req, res) {
    delete req.session.destroy();
    res.redirect("../");
  });

//route for register new user.
router.route("/register")
    .get(function(req, res) {

        res.render("users/register");
    })
    .post(function(req, res) {
      //xss filter inputs.
      let usrname = xss(req.body.username);
      let passwrd = xss(req.body.password);
      let email = xss(req.body.email);
      //regex for email.
      let expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
      let regex = new RegExp(expression);

      //validate input fields.
      if(usrname === undefined || usrname === '' || passwrd === undefined || passwrd === '')
      {
        return res.status(400).render("users/register", {error: "No input on username or password"});
      }
      else if(passwrd.length < 6)
      {
        return res.status(400).render("users/register", {error: "Password must be atleast 6 characters long."});
      }
      else if(usrname.length > 31 || passwrd.length > 31)
      {
          return res.status(400).render("users/register", {error: "Username and or password can't be longer than 30 characters."});
      }
      else if(!email.match(regex))
      {
        return res.status(400).render("users/register", {error: "Enter a valid email adress"});
      }
      else
      { //valid input and user doesn't exists, then create user.
        let user = new User({
          username: usrname,
          password: passwrd,
          email: email


      });
      //saving user in db with mongoose command .save and send flash mess-
      user.save().then(function() {

        return res.redirect("../");
      }).catch(function(error) {
          console.log(error.message);
        return res.status(500).render("users/register", {error: "Something went wrong with the registration"});
      });
    }


});
//export router.
module.exports = router;
