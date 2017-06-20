/*jshint esversion:6 */
let router = require("express").Router();//using express router
let xss = require('xss');//using xss lib to filter bad chars.
//db models.
let Genre = require("../models/Genre");
let Slack = require("../models/Slack");
let User = require("../models/User");
//route to view all genres
router.route("/")
.get(function(req, res) {
  if(!req.session.loggedin) // if no login then send to root.
  {
    req.session.flash = {
      type: "error",
      message: "Login to view genres"
    };
    res.redirect("../../");

  }
  else {
    Genre.find({}, function(error, data) {

      var contxt = {
        items: data.map(function(item) {
          return {

            genre: item.genre,
            imgpath:item.imgpath

          };
        }),
      };
      res.render("genres/index", {genres:contxt.items});
    });
  }
});
//route to create genre.
router.route("/create")
.get(function(req, res) {
  if(!req.session.loggedin) //redirct if no login.
  {
    req.session.flash = {
      type: "error",
      message: "Login to create new genre"
    };
    res.redirect("../../");

  }
  else if(req.session.admin && req.session.loggedin) //if admin then view admin view for create genre
  {
    res.render("genres/createAdmin");
  }
  else { //if user then show create genre view.
    res.render("genres/create");
  }
}).post(function(req,res)
{

  if((req.session.loggedin && !req.session.admin) || req.body.test === process.env['secret_test'])
  {
    console.log("in create genre");
    let genre = xss(req.body.genre);


    if(genre === undefined || genre === '' || genre.length < 1)
    {
      return res.status(400).render("genres/create", {error: "No input on genre name"});

    }
    else if( genre.length > 50)
    {
      return res.status(400).render("genres/create", {error: "Genre name can't be longer than 50 characters"});
    }
    else
    {
      genre = genre.replace(/\//g, "");


      if(req.body.test === process.env['secret_test']) //if tests is running set username to req.body instead of req.session.
      {
        let genreObj = new Genre({
          genre: genre,
          username: req.body.username
        });

        genreObj.save().then(function() {
          req.session.flash = {
            type: "successful",
            message: "Genre was created"
          };
          return res.redirect("../genres");
        }).catch(function(error) {
          console.log(error.message);
          return res.status(500).render("genres/create", {error: "Something went wrong with the registration"});
        });
      }
      else{
        //if not testing add new genre obj with req.session instead.
        let genreObj = new Genre({
          genre: genre,
          username: req.session.username
        });
        //save genre obj if no db error
        genreObj.save().then(function() {
          //finding users so send slack notifications to, about new genre created.
          User.find({}, function(error, user)
          {


            if(user !== undefined || user !== null)
            {
              for(i=0; i<user.length; i++)
              {
                if(user[i].username !== undefined)
                {
                  Slack.findOne({username:user[i].username}, function(error, slack)
                  {
                    if(slack !== null)
                    {
                      //if settings on then send else not.
                      if(slack.slack)
                      {
                        var hookmsg ='New genre notification. Action: Created, Title: '+genre+' by User: '+req.session.username+'';
                        var slackAPI = require("../webapi/slackAPI.js")(process.env['slack_api_token']);
                        slackAPI.postWebhook(slack.slackusername, hookmsg).then(function(response)
                        {
                          console.log(response);
                        }).catch(function(err)
                        {

                          console.log("error");

                        });
                      }
                    }
                  });
                }

              }
            }


          });

          //send success message.
          req.session.flash = {
            type: "successful",
            message: "Genre was created"
          };
          return res.redirect("../genres");

        }).catch(function(error) {
          console.log(error.message);
          return res.status(500).render("genres/create", {error: "Something went wrong when creating genre"});
        });
      }


    }
  }
  else if(req.session.admin && req.session.loggedin)// if admin then post post new genre.
  { //xss filter input
    let genre = xss(req.body.genre);
    let image = req.files.imgFile;
    //validate input fields.
    if(genre === undefined || genre === '' || genre.length < 1)
    {
      return res.status(400).render("genres/createAdmin", {error: "No input on genre name"});

    }
    else if( genre.length > 50)
    {
      return res.status(400).render("genres/createAdmin", {error: "Genre name can't be longer than 50 characters"});
    }
    else if((image !== undefined && !image.mimetype.startsWith('image')))
    {
      return res.status(400).render("genres/createAdmin", {error:"Upload is not a image"});
    }
    else
    {
      genre = genre.replace(/\//g, "");
      let genreObj;
      //if image is empty create genre with standard img.
      if(image === undefined)
      {
        genreObj = new Genre({
          genre: genre,
          username: req.session.username
        });
      }
      else{
        //add img to img folder and add path to db.
        image.mv('public/images/'+image.name,function(err)
        {
          if(err)
          {
            console.log(err);
          }

        });
        var imgpath = '/images/'+image.name;
        //set genre details for new genre obj.
        genreObj = new Genre({
          genre: genre,
          username: req.session.username,
          imgpath:imgpath
        });
      }
      //if no err then save genre obj in db.
      genreObj.save().then(function() {
        //find users to be notified when new genre is created
        User.find({}, function(error, user)
        {
          if(user !== undefined || user !== null)
          {
            for(i=0; i<user.length; i++)
            {
              if(user[i].username !== undefined)
              {
                Slack.findOne({username:user[i].username}, function(error, slack)
                {
                  if(slack !== null)
                  {
                    //if settings is on then send notes else not.
                    if(slack.slack)
                    {
                      var hookmsg ='New genre notification. Action: Created, Title: '+genre+' by User: '+req.session.username+'';
                      var slackAPI = require("../webapi/slackAPI.js")(process.env['slack_api_token']);
                      slackAPI.postWebhook(slack.slackusername, hookmsg).then(function(response)
                      {
                        console.log(response);
                      }).catch(function(err)
                      {

                        console.log("error");

                      });
                    }
                  }
                });
              }

            }
          }


        });

        //send success message and redirect to genres.
        req.session.flash = {
          type: "successful",
          message: "Genre was created"
        };
        return res.redirect("../genres");

      }).catch(function(error) {//catch db errors.
        console.log(error.message);
        return res.status(500).render("genres/createAdmin", {error: "Something went wrong when creating genre"});
      });



    }
  }
  else{ //if no login then redirect to root and send err mess.
    req.session.flash = {
      type: "error",
      message: "Login to create a new genre"
    };
    res.redirect('../../../');
  }


});
//route to update genre.
router.route("/update/:genre")
.get(function(req, res) {

  //xss filter inputs.
  let genre = xss(req.params.genre);
  let user = xss(req.session.username);

  if(!req.session.admin && req.session.loggedin) //If user is logged in then render update view.
  {

    //find genre for user if not found then user is not owner or genre not exist.
    Genre.findOne({genre:genre, username:user }, function(error, data) {
      if(data === null)
      {
        req.session.flash = {
          type: "error",
          message: "You don't have access to do that"
        };
        res.redirect('../../genres');
      }
      else{
        return res.render("genres/update",{genre:genre});
      }

    });
  }
  else if(req.session.admin && req.session.loggedin) //If logged in as admin
  { //if genre exists then render admin update genre view.
    Genre.findOne({genre:genre}, function(error, data) {
      if(data === null)
      {
        req.session.flash = {
          type: "error",
          message: "Couldn't find genre"
        };
        res.redirect('../../genres');
      }
      else{
        return res.render("genres/updateAdmin",{genre:genre});
      }

    });
  }
  else{ // if no login then redirect to root and send err mess.
    req.session.flash = {
      type: "error",
      message: "Login to edit genre"
    };
    res.redirect('../../');
  }




}).post(function(req,res)
{
  //xss filter inputs.
  let genre = xss(req.body.genre);
  let user = xss(req.session.username);
  let id = xss(req.params.genre);
  //If logged in as user or testing then continue.
  if((!req.session.admin && req.session.loggedin) || req.body.test === process.env['secret_test'])
  {
    //If send input is equal to secret_test var then set user var.
    if(req.body.test === process.env['secret_test'])
    {
      user = req.body.username;
    }
    //If genre found then continue else send err mess.
    Genre.findOne({genre:id, username:user }, function(error, data) {

      if(data === null)
      {
        req.session.flash = {
          type: "error",
          message: "You don't have access to do that"
        };
        console.log("You don't have access to do that");
        res.redirect('../../genres');
      }
      else{
        //validate input fields.
        if(genre === undefined || genre === '' || genre.length < 1)
        {
          return res.status(400).render("genres/update", {error:"No input on genre name", genre:id});
        }
        else if(genre.length > 50)
        {
          return res.status(400).render("genres/update", {error:"Genre name can't be longer than 50 characters", genre:id});
        }
        else{
          genre = genre.replace(/\//g, "");
          //update db field to input.
          data.genre = genre;
          //if no db err then save genre in db.
          data.save().then(function() {
            req.session.flash = {
              type: "successful",
              message: "Genre was updated"
            };
            return res.redirect("../../genres");
          }).catch(function(error) {
            console.log(error.message);
            return res.status(500).render("genres/update", {error: "Something went wrong when updating genre", genre:id});
          });
        }


      }

    });
  }
  else if(req.session.admin && req.session.loggedin) // If admin
  {

    let image = req.files.imgFile;
    //if genre exists then continue else send err mess.
    Genre.findOne({genre:id}, function(error, data) {

      if(data === null)
      {
        req.session.flash = {
          type: "error",
          message: "Couldn't find genre"
        };
        console.log("You don't have access to do that");
        res.redirect('../../genres');
      }
      else{
        //validate input fields.
        if(genre === undefined || genre === '' || genre.length < 1)
        {
          return res.status(400).render("genres/updateAdmin", {error:"No input on genre name", genre:id});
        }
        else if(genre.length > 50)
        {
          return res.status(400).render("genres/updateAdmin", {error:"Genre name can't be longer than 40 characters", genre:id});
        }
        else if((image !== undefined && !image.mimetype.startsWith('image')))
        {
          return res.status(400).render("genres/updateAdmin", {error:"Upload is not a image", genre:id});
        }
        else{
          genre = genre.replace(/\//g, "");
          //if image not empty.
          if(image)
          {
            image.mv('public/images/'+image.name,function(err)
            {
              if(err)
              {
                console.log(err);
              }

            });
            data.imgpath = '/images/'+image.name;
          }
          //update field in db.
          data.genre = genre;
          //if no db err then save genre.
          data.save().then(function() {
            req.session.flash = {
              type: "successful",
              message: "Genre was updated"
            };
            return res.redirect("../../genres");
          }).catch(function(error) {
            console.log(error.message);
            return res.status(500).render("genres/updateAdmin", {error: "Something went wrong when updating genre", genre:id});
          });
        }


      }

    });
  }
  else{ //if no login then redirect to root and send err mess.
    req.session.flash = {
      type: "error",
      message: "Login to edit genre"
    };
    res.redirect('../../');
  }
});

//route to delete genre.
router.route("/delete/:genre")
.get(function(req, res) {

  //xss filter inputs.
  let genre = xss(req.params.genre);
  let user = xss(req.session.username);

  if(!req.session.admin && req.session.loggedin) //If user
  {
    //find genre to delete else send err mess.
    Genre.findOne({genre:genre, username:user }, function(error, data) {

      if(data === null)
      {
        req.session.flash = {
          type: "error",
          message: "You don't have access to do that"
        };
        res.redirect('../../genres');
      }
      else{
        return res.render("genres/delete",{genre:genre});
      }

    });
  }
  else if(req.session.admin && req.session.loggedin) //If admin
  { //if genre exist else send err mess.
    Genre.findOne({genre:genre}, function(error, data) {

      if(data === null)
      {
        req.session.flash = {
          type: "error",
          message: "Couldn't find genre"
        };
        res.redirect('../../genres');
      }
      else{
        return res.render("genres/delete",{genre:genre});
      }

    });
  }
  else{ //if no login then redirect to root and send err mess.
    req.session.flash = {
      type: "error",
      message: "Login to delete genre"
    };
    res.redirect('../../../');
  }




}).post(function(req,res)
{
  //xss filter inputs.
  let genre = xss(req.body.genre);
  let user = xss(req.session.username);
  let id = xss(req.params.genre);
  //if user or testing then continue.
  if((!req.session.admin && req.session.loggedin) || req.body.test === process.env['secret_test'])
  { //if input test is equal to secret_test var then set user var.
    if(req.body.test === process.env['secret_test'])
    {
      user = req.body.username;
    }
    //find genre to delete else send err mess.
    Genre.findOne({genre:id, username:user }, function(error, data) {

      if(data === null)
      {

        req.session.flash = {
          type: "error",
          message: "You don't have access to do that"
        };
        res.redirect('../../genres');
      }
      else{
        //find and remove genre if no db err.
        Genre.findOneAndRemove({genre: data.genre}).exec().then(function()
        {
          req.session.flash = {
            type: "successful",
            message: "Genre was deleted"
          };
          res.redirect("../../genres");
        }).catch(function(err)
        {
          console.log(error.message);
          res.status(500).render("genres/delete", {error: "Something went wrong when deleting genre", genre:id});
        });


      }

    });
  }
  else if(req.session.admin && req.session.loggedin) //If admin.
  { //if genre exists else send err mess.
    Genre.findOne({genre:id}, function(error, data) {

      if(data === null)
      {

        req.session.flash = {
          type: "error",
          message: "Couldn't find genre"
        };
        res.redirect('../../genres');
      }
      else{
        //find genre to delete if no db err.
        Genre.findOneAndRemove({genre: data.genre}).exec().then(function()
        {
          req.session.flash = {
            type: "successful",
            message: "Genre was deleted"
          };
          res.redirect("../../genres");
        }).catch(function(err)
        {
          console.log(error.message);
          res.status(500).render("genres/delete", {error: "Something went wrong when deleting genre", genre:id});
        });


      }

    });
  }
  else{//if no login then redirect and send err mess.
    req.session.flash = {
      type: "error",
      message: "Login to delete genre"
    };
    res.redirect('../../');
  }
});
//export router.
module.exports = router;
