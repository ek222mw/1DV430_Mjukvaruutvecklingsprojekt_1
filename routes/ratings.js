/*jshint esversion:6 */
let router = require("express").Router();
let xss = require('xss');
let Album = require("../models/Album");
let Rating = require("../models/Rating");
//router for creating rating on albums.
router.route("/create")
.get(function(req, res) {
  if(!req.session.loggedin) // if no login redirect to root and send err mess.
  {
    req.session.flash = {
      type: "error",
      message: "Login to create new rating"
    };
    res.redirect("../../../../");

  }
  else { // find albums to render.
    Album.find({}, function(error, data) {

      var contxt = {
        items: data.map(function(item) {
          return {
            album: item.album
          };
        }),
      };
      res.render("ratings/create", {albums:contxt.items});
    });

  }
}).post(function(req,res)
{

  if(req.session.loggedin) // If user
  {
    //xss filter inputs.
    let album = xss(req.body.album);
    let rating = xss(req.body.rating);
    //get albums as promise to server views with dropdown data when error occurs.
    let albums = getPromise();


    //See if user have set rating already on album.
    Rating.findOne({username: req.session.username, album:album}, function(error, data)
    {
      if(data === null) //if null then create new rating on album.
      {
        Album.findOne({album:album}, function(error, result)
        {
          //if result not null then continue.
          if(result !== null)
          {

            //validate input fields.
            if(album === undefined || album === '' || album.length < 1)
            {
              albums.then(function(data)
              {
                var contxt = {
                  items: data.map(function(item) {
                    return {
                      album: item.album
                    };
                  }),
                };
                return res.status(400).render("ratings/create", {error: "No input on album name", albums:contxt.items});
              });

            }
            else if(album.length > 50)
            {
              albums.then(function(data)
              {
                var contxt = {
                  items: data.map(function(item) {
                    return {
                      album: item.album
                    };
                  }),
                };
                return res.status(400).render("ratings/create", {error: "Album name can't be longer than 50 characters", albums:contxt.items});
              });
            }
            else if(rating === undefined || rating === '' || rating.length < 1)
            {
              albums.then(function(data)
              {
                var contxt = {
                  items: data.map(function(item) {
                    return {
                      album: item.album
                    };
                  }),
                };
                return res.status(400).render("ratings/create", {error: "No input on rating", albums:contxt.items});
              });

            }
            else if(rating < 1 && rating > 10)
            {
              albums.then(function(data)
              {
                var contxt = {
                  items: data.map(function(item) {
                    return {
                      album: item.album
                    };
                  }),
                };
                return res.status(400).render("ratings/create", {error: "Rating must be between number 1 and 10", albums:contxt.items});
              });
            }
            else
            {
              //if all fields is valid then create new Rating obj.
              let ratingObj = new Rating({
                album: album,
                rating: rating,
                username: req.session.username
              });
              //if no db err then save Rating obj in db.
              ratingObj.save().then(function() {
                req.session.flash = {
                  type: "successful",
                  message: "Rating was created"
                };
                return res.redirect("../../../../genres/");
              }).catch(function(error) {
                console.log(error.message);
                albums.then(function(data)
                {
                  var contxt = {
                    items: data.map(function(item) {
                      return {
                        album: item.album
                      };
                    }),
                  };
                  return res.status(500).render("ratings/create", {error: "Something went wrong when creating rating", albums:contxt.items});
                });
              });
            }
          }
          else{
            albums.then(function(data)
            {
              var contxt = {
                items: data.map(function(item) {
                  return {
                    album: item.album
                  };
                }),
              };
              return res.status(400).render("ratings/create", {error: "The album inputed doesn't exist", albums:contxt.items});
            });
          }
        });
      }
      else{
        albums.then(function(data)
        {
          var contxt = {
            items: data.map(function(item) {
              return {
                album: item.album
              };
            }),
          };
          return res.status(400).render("ratings/create", {error: "User have already rated this album", albums:contxt.items});
        });
      }
    });

  }
  else{
    req.session.flash = {
      type: "error",
      message: "Login to create a new rating"
    };
    res.redirect('../../../../');
  }


});
//route for updating ratings.
router.route("/update")
.get(function(req, res) {
  if(!req.session.loggedin) //If no user.
  {
    req.session.flash = {
      type: "error",
      message: "Login to edit rating"
    };
    res.redirect("../../../../../");

  }
  else {
    //find all ratings for user and render view.
    Rating.find({username:req.session.username}, function(error, data) {

      var contxt = {
        items: data.map(function(item) {
          return {
            rating: item.rating,
            album: item.album
          };
        }),
      };
      res.render("ratings/update", {ratings:contxt.items});
    });

  }
}).post(function(req,res)
{
  if(req.session.loggedin) // If user.
  { //xss filter inputs.
    let album = xss(req.body.album);
    let rating = xss(req.body.rating);
    //get ratings as promise for logged in user.
    let ratings = getPromiseRating(req);

    //finding rating for album for user, else send err mess.
    Rating.findOne({username: req.session.username, album:album}, function(error, data)
    {
      if(data !== null)
      { //see if input not manipulated and exist in albums.
        Album.findOne({album:album}, function(error, result)
        {
          if(result !== null)
          {

            //validating inputs.
            if(album === undefined || album === '' || album.length < 1)
            {
              ratings.then(function(data)
              {
                var contxt = {
                  items: data.map(function(item) {
                    return {
                      rating: item.rating,
                      album: item.album
                    };
                  }),
                };
                return res.status(400).render("ratings/update", {error: "No input on album name", ratings:contxt.items});
              });

            }
            else if(album.length > 50)
            {
              ratings.then(function(data)
              {
                var contxt = {
                  items: data.map(function(item) {
                    return {
                      rating: item.rating,
                      album: item.album
                    };
                  }),
                };
                return res.status(400).render("ratings/update", {error: "Album name can't be longer than 50 characters", ratings:contxt.items});
              });
            }
            else if(rating === undefined || rating === '' || rating.length < 1)
            {
              ratings.then(function(data)
              {
                var contxt = {
                  items: data.map(function(item) {
                    return {
                      rating: item.rating,
                      album: item.album
                    };
                  }),
                };
                return res.status(400).render("ratings/update", {error: "No input on rating", ratings:contxt.items});
              });

            }
            else if(rating < 1 && rating > 10)
            {
              ratings.then(function(data)
              {
                var contxt = {
                  items: data.map(function(item) {
                    return {
                      rating: item.rating,
                      album: item.album
                    };
                  }),
                };
                return res.status(400).render("ratings/update", {error: "Rating must be between number 1 and 10", ratings:contxt.items});
              });
            }
            else
            {
              //update field in db.
              data.rating = rating;
              //if no db err then save updated rating.
              data.save().then(function() {
                req.session.flash = {
                  type: "successful",
                  message: "Rating was updated"
                };
                return res.redirect("../../../../genres/");
              }).catch(function(error) {
                console.log(error.message);
                ratings.then(function(data)
                {
                  var contxt = {
                    items: data.map(function(item) {
                      return {
                        rating: item.rating,
                        album: item.album
                      };
                    }),
                  };
                  return res.status(500).render("ratings/update", {error: "Something went wrong when updating rating", ratings:contxt.items});
                });
              });
            }
          }
          else{
            ratings.then(function(data)
            {
              var contxt = {
                items: data.map(function(item) {
                  return {
                    rating: item.rating,
                    album: item.album
                  };
                }),
              };
              return res.status(400).render("ratings/update", {error: "The album inputed doesn't exist", ratings:contxt.items});
            });
          }
        });
      }
      else{
        ratings.then(function(data)
        {
          var contxt = {
            items: data.map(function(item) {
              return {
                rating: item.rating,
                album: item.album
              };
            }),
          };
          return res.status(400).render("ratings/update", {error: "Couldn't find rating to edit", ratings:contxt.items});
        });
      }
    });

  }
  else{//if no login.
    req.session.flash = {
      type: "error",
      message: "Login to edit rating"
    };
    res.redirect('../../../../../');
  }
});
//route to delete ratings.
router.route("/delete")
.get(function(req, res) {
  if(!req.session.loggedin) //If no login
  {
    req.session.flash = {
      type: "error",
      message: "Login to delete rating"
    };
    res.redirect("../../../../../");

  }
  else {
    //finding ratings for user.
    Rating.find({username:req.session.username}, function(error, data) {

      var contxt = {
        items: data.map(function(item) {
          return {
            rating: item.rating,
            album: item.album
          };
        }),
      };
      res.render("ratings/delete", {ratings:contxt.items});
    });

  }
}).post(function(req,res)
{
  if(req.session.loggedin) //If login User.
  { //xss filter input.
    let album = xss(req.body.album);
    //get ratings as promise for logged in user.
    let ratings = getPromiseRating(req);
    //finding rating on album for user to delete else send err mess.
    Rating.findOne({username: req.session.username, album:album}, function(error, data)
    {
      if(data !== null)
      { //if data not null then find and remove rating from album.
        Rating.findOneAndRemove({username:req.session.username, album: data.album}).exec().then(function()
        {
          req.session.flash = {
            type: "successful",
            message: "Rating was deleted"
          };
          res.redirect("../../../../genres");
        }).catch(function(err)
        {
          console.log(error.message);
          ratings.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  rating: item.rating,
                  album: item.album
                };
              }),
            };
            res.status(500).render("ratings/delete", {error: "Something went wrong when deleting rating", ratings:contxt.items});
          });
        });

      }
      else{
        ratings.then(function(data)
        {
          var contxt = {
            items: data.map(function(item) {
              return {
                rating: item.rating,
                album: item.album
              };
            }),
          };
          return res.status(400).render("ratings/delete", {error: "Couldn't find rating to delete", ratings:contxt.items});
        });
      }
    });

  }
  else{ //If no login.
    req.session.flash = {
      type: "error",
      message: "Login to delete rating"
    };
    res.redirect('../../../../../');
  }
});
//route to find ratings for album.
router.route("/:album")
.get(function(req, res) {
  if(!req.session.loggedin) // if no login.
  {
    req.session.flash = {
      type: "error",
      message: "Login to show rating of album"
    };
    res.redirect("../../../../");

  }
  else {
    //xss filter input.
    let album = xss(req.params.album);
    //finding ratings for album.
    Rating.find({album:album}, function(error, data) {
      //calculate average rating for album and render it.
      var sum = 0;
      var average = 0;
      if(data.length > 0)
      {


        for(i= 0; i<data.length; i++)
        {
          sum += data[i].rating;
        }
        if(data.length > 0)
        {
          average = sum/data.length;
        }

        res.render("ratings/index", {rating:average, album:data[0].album});
      }
      else{
        res.render("ratings/index");
      }

    });

  }
});
//func to transform album into promise album.
function getPromise(){
  var promise = Album.find({}).exec();
  return promise;
}

function getPromiseRating(req){
  var promise = Rating.find({username:req.session.username}).exec();
  return promise;
}

//export router.
module.exports = router;
