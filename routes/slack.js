/*jshint esversion:6 */
let router = require("express").Router(); //use express router.
let User = require("../models/User");
let Slack = require("../models/Slack");
var slackAPI = require("../webapi/slackAPI.js")(process.env['slack_api_token']); //use slack api helper to send requests to slack.
let xss = require('xss'); //use xss lib to filter bad chars.
//route to invite users to slack.
router.route("/invite")
.get(function(req, res) {
  if(!req.session.loggedin) //If no login.
  {
    req.session.flash = {
      type: "error",
      message: "Login to slack invite"
    };
    res.redirect("../../");

  }
  else { //render invite view.
    res.render("slack/invite");
  }
}).post(function(req,res)
{
  if(req.session.loggedin) //If login user.
  { //find user else send err mess.
    User.findOne({username:req.session.username }, function(error, user) {
      if(user === null)
      {
        req.session.flash = {
          type: "error",
          message: "Couldn't find the user"
        };
        res.redirect('../../slack/invite');
      }
      else{
        //Try to send invite to users email if not already got invite.
        slackAPI.postInviteTeam(user.email).then(function(response)
        { //parse to json obj.
          var resObj = JSON.parse(response);
          if(!resObj.ok) //if res not ok then send err mess.
          {
            req.session.flash = {
              type: "error",
              message: "The email registered on that user has already been invited to the team"
            };
            res.redirect('../../slack/invite');
          }
          else{ //else send success mess and redirect.
            req.session.flash = {
              type: "success",
              message: "Invitation successfully sent to email"
            };
            res.redirect('../../genres');
          }


        });
      }

    });
  }
  else{
    req.session.flash = { //If no login.
      type: "error",
      message: "Login to slack invite"
    };
    res.redirect('../../');
  }


});

//route to verify email to find slack username.
router.route("/verify")
.get(function(req, res) {
  if(!req.session.loggedin) //If no login.
  {
    req.session.flash = {
      type: "error",
      message: "Login to verify slack username"
    };
    res.redirect("../../");

  }
  else { //render verify view.
    res.render("slack/verify");
  }
}).post(function(req,res)
{
  if(req.session.loggedin)
  { //find user else send err mess.
    User.findOne({username:req.session.username }, function(error, user) {
      if(user === null)
      {
        req.session.flash = {
          type: "error",
          message: "Couldn't find the user"
        };
        res.redirect('../../slack/verify');
      }
      else{
        var slackusername;
        var found = false;
        //use user email to find slack name and save it in db.
        slackAPI.postGettingUsername().then(function(response)
        {
          var resObj = JSON.parse(response);
          for(i = 0; i<resObj.members.length; i++)
          {
            if(resObj.members[i].profile.email === user.email)
            {
              found = true;
              //found email on slack now take the username
              slackusername = resObj.members[i].name;
                //If not exists in Slack table then add and save else update it.
                Slack.findOne({username:req.session.username }, function(error, user) {
                  if(user === null)
                  {
                    slackObj = new Slack({
                      username: req.session.username,
                      slackusername: slackusername
                    });
                    slackObj.save().then(function()
                    {
                      req.session.flash = {
                        type: "success",
                        message: "Slack username was found and saved in db and added to settings"
                      };
                      res.redirect('../../genres');
                    }).catch(function(err)
                    {
                      req.session.flash = {
                        type: "error",
                        message: "Something went wrong when trying to save slack settings"
                      };
                      res.redirect('../../slack/verify');
                    });
                  }
                  else{
                    user.slackusername = slackusername;
                    user.save().then(function()
                    {
                      req.session.flash = {
                        type: "success",
                        message: "Slack username was found and updated in db, settings already exists"
                      };
                      res.redirect('../../genres');
                    }).catch(function(err)
                    {
                      req.session.flash = {
                        type: "error",
                        message: "Something went wrong when trying to update slack username"
                      };
                      res.redirect('../../slack/verify');
                    });

                  }

                });



            }
          }
          if(!found) // if not found then send err mess.
          {
            req.session.flash = {
              type: "error",
              message: "Couldn't find email in slack channel, don't forget to register and join channel first"
            };
            res.redirect('../../slack/verify');
          }

        }).catch(function(err) // Api err make sure to input correct api key.
      {
        req.session.flash = {
          type: "error",
          message: "Answer null, make sure give right token to api"
        };
        res.redirect('../../slack/verify');
      });
      }

    });
  }
  else{ // if no login.
    req.session.flash = {
      type: "error",
      message: "Login to verify slack username"
    };
    res.redirect('../../');
  }


});
//route to slack settings.
router.route("/settings")
.get(function(req,res)
{
  if(req.session.loggedin) // if login user.
  {
  //try to find settings for user and render else send err mess.
  Slack.findOne({username:req.session.username}, function(error,user)
  {
    if(user === null)
    {
      req.session.flash = {
        type: "error",
        message: "Couldn't find any settings for user on slack, please verify after doing an invite to email"
      };
      res.redirect('../../genres');
    }
    else{

      res.render("slack/settings", {slack:user.slack});
    }
  });
}
else{
  req.session.flash = {
    type: "error",
    message: "Login to edit slack settings"
  };
  res.redirect('../../');
}


}).post(function(req,res)
{ //xss filter input.
  let slack = xss(req.body.slack);
  if(req.session.loggedin) //If login user.
  { //try find user in slack table in db else send err mess.
    Slack.findOne({username:req.session.username}, function(error,user)
    {
      if(user === null)
      {
        req.session.flash = {
          type: "error",
          message: "Couldn't change slack settings, to forget to verify after doing invite"
        };
        res.redirect('../../genres');
      }
      else{
        //if found then change settings in db.
        user.slack = slack;
        user.save().then(function()
        {
          req.session.flash = {
            type: "success",
            message: "Slack settings was changed"
          };
          res.redirect('../../slack/settings');
        }).catch(function(err)
        {
          req.session.flash = {
            type: "error",
            message: "Something went wrong when trying to edit slack settings"
          };
          res.redirect('../../genres');
        });

      }
    });
  }
  else{ //If no login.
    req.session.flash = {
      type: "error",
      message: "Login to edit slack settings"
    };
    res.redirect('../../');
  }


});
//route to unsubscribe from slack.
router.route("/unsubscribe")
.get(function(req,res)
{
  if(req.session.loggedin) //If login user.
  {
    //Try to find slack settings for user else send err mess.
    Slack.findOne({username:req.session.username}, function(error, data) {

      if(data === null)
      {
        req.session.flash = {
          type: "error",
          message: "Couldn't find slack subscription, subscribe by verifying"
        };
        res.redirect('../../genres');
      }
      else{
        return res.render("slack/unsubscribe");
      }

    });
  }
  else{ //If no login.
    req.session.flash = {
      type: "error",
      message: "Login to unsubscribe from slack"
    };
    res.redirect('../../');
  }
}).post(function(req,res)
{
  if(req.session.loggedin) // If login user.
  {
    //Try find slack settings for user else send err mess.
    Slack.findOne({username:req.session.username}, function(error, data) {

      if(data === null)
      {
        req.session.flash = {
          type: "error",
          message: "Couldn't find slack subscription, subscribe by verifying"
        };
        res.redirect('../../genres');
      }
      else{
        //If found then remove slack settings for user.
        Slack.findOneAndRemove({username: data.username}).exec().then(function()
        {
          req.session.flash = {
            type: "successful",
            message: "User was successfully removed from slack subscribers"
          };
          res.redirect("../../genres");
        }).catch(function(err)
        {
          console.log(error.message);
          res.status(500).render("slack/unsubscribe", {error: "Something went wrong when trying to unsubscribe from slack"});
        });
      }

    });
  }
  else{ //If no login.
    req.session.flash = {
      type: "error",
      message: "Login to unsubscribe from slack"
    };
    res.redirect('../../');
  }
});


//export router.
module.exports = router;
