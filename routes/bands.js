/*jshint esversion:6 */
let router = require("express").Router(); //use express router
let xss = require('xss'); //xss filtering bad characters
let Band = require("../models/Band");
let Genre = require("../models/Genre");


//route to create band
router.route("/create")
.get(function(req, res) {
  if(!req.session.loggedin)//if not logged in redirect to root and send err mess.
  {
    req.session.flash = {
      type: "error",
      message: "Login to create new band"
    };
    res.redirect("../../");

  }
  else if(req.session.admin && req.session.loggedin)//if admin show admin create band view
  {
    Genre.find({}, function(error, data) {

      var contxt = {
        items: data.map(function(item) {
          return {
            genre: item.genre
          };
        }),
      };
      res.render("bands/createAdmin", {genres:contxt.items});
    });
  }
  else { //if user show create band view
    Genre.find({}, function(error, data) {

      var contxt = {
        items: data.map(function(item) {
          return {
            genre: item.genre
          };
        }),
      };
      res.render("bands/create", {genres:contxt.items});
    });

  }
}).post(function(req,res)
{

  if(!req.session.admin && req.session.loggedin) // if user post create band
  {
    //xss filter
    let genre = xss(req.body.genre);
    let disco = xss(req.body.discography);
    let bio = xss(req.body.biography);
    let bandname = xss(req.body.band);
    //get genres from db as promise.
    var genres = getPromise();
    //validating fields, if error show view with error
    if(genre === undefined || genre === '' || genre.length < 1)
    {
      genres.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              genre: item.genre
            };
          }),
        };
        return res.status(400).render("bands/create", {error: "No input on genre name", genres:contxt.items});
      });

    }
    else if(genre.length > 50)
    {
      genres.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              genre: item.genre
            };
          }),
        };
        return res.status(400).render("bands/create", {error: "Genre name can't be longer than 50 characters", genres:contxt.items});
      });
    }
    else if(disco === undefined || disco === '' || disco.length < 1)
    {
      genres.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              genre: item.genre
            };
          }),
        };
        return res.status(400).render("bands/create", {error: "No input on discography", genres:contxt.items});
      });
    }
    else if( disco.length > 3000)
    {
      genres.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              genre: item.genre
            };
          }),
        };
        return res.status(400).render("bands/create", {error: "Discography can't be longer than 3000 characters", genres:contxt.items});
      });
    }
    else if(bio === undefined || bio === '' || bio.length < 1)
    {
      genres.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              genre: item.genre
            };
          }),
        };
        return res.status(400).render("bands/create", {error: "No input on biography", genres:contxt.items});
      });
    }
    else if( bio.length > 3000)
    {
      genres.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              genre: item.genre
            };
          }),
        };
        return res.status(400).render("bands/create", {error: "Biography name can't be longer than 3000 characters", genres:contxt.items});
      });
    }
    else if(bandname === undefined || bandname === '' || bandname.length < 1)
    {
      genres.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              genre: item.genre
            };
          }),
        };
        return res.status(400).render("bands/create", {error: "No input on band", genres:contxt.items});
      });
    }
    else if(bandname.length > 50)
    {
      genres.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              genre: item.genre
            };
          }),
        };
        return res.status(400).render("bands/create", {error: "Band name can't be longer than 50 characters", genres:contxt.items});
      });
    }
    else
    {
      //replace / with ""
      genre = genre.replace(/\//g, "");
      disco = disco.replace(/\//g, "");
      bio = bio.replace(/\//g, "");
      bandname = bandname.replace(/\//g, "");
      //if all fields valid then create new band object.
      let band = new Band({
        band: bandname,
        biography: bio,
        discography: disco,
        genre: genre,
        username: req.session.username
      });
      //if no err in db then save band object.
      band.save().then(function() {
        req.session.flash = {
          type: "successful",
          message: "Band was created"
        };
        return res.redirect("../../genres");
      }).catch(function(error) {
        console.log(error.message);
        genres.then(function(data)
        {

          var contxt = {
            items: data.map(function(item) {
              return {
                genre: item.genre
              };
            }),
          };
          return res.status(500).render("bands/create", {error: "Something went wrong when creating band", genres:contxt.items});
        });
      });
    }

  }
  else if(req.session.admin && req.session.loggedin) //if admin then post create band
  {
    //xss filter
    let genre = xss(req.body.genre);
    let disco = xss(req.body.discography);
    let bio = xss(req.body.biography);
    let bandname = xss(req.body.band);
    let image = req.files.imgFile;
    //get genres from db as promise.
    var genres = getPromise();

    //validatinf input fields
    if(genre === undefined || genre === '' || genre.length < 1)
    {
      genres.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              genre: item.genre
            };
          }),
        };
        return res.status(400).render("bands/createAdmin", {error: "No input on genre name", genres:contxt.items});
      });

    }
    else if(genre.length > 50)
    {
      genres.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              genre: item.genre
            };
          }),
        };
        return res.status(400).render("bands/createAdmin", {error: "Genre name can't be longer than 50 characters", genres:contxt.items});
      });
    }
    else if(disco === undefined || disco === '' || disco.length < 1)
    {
      genres.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              genre: item.genre
            };
          }),
        };
        return res.status(400).render("bands/createAdmin", {error: "No input on discography", genres:contxt.items});
      });
    }
    else if( disco.length > 3000)
    {
      genres.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              genre: item.genre
            };
          }),
        };
        return res.status(400).render("bands/createAdmin", {error: "Discography can't be longer than 3000 characters", genres:contxt.items});
      });
    }
    else if(bio === undefined || bio === '' || bio.length < 1)
    {
      genres.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              genre: item.genre
            };
          }),
        };
        return res.status(400).render("bands/createAdmin", {error: "No input on biography", genres:contxt.items});
      });
    }
    else if( bio.length > 3000)
    {
      genres.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              genre: item.genre
            };
          }),
        };
        return res.status(400).render("bands/createAdmin", {error: "Biography name can't be longer than 3000 characters", genres:contxt.items});
      });
    }
    else if(bandname === undefined || bandname === '' || bandname.length < 1)
    {
      genres.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              genre: item.genre
            };
          }),
        };
        return res.status(400).render("bands/createAdmin", {error: "No input on band", genres:contxt.items});
      });
    }
    else if(bandname.length > 50)
    {
      genres.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              genre: item.genre
            };
          }),
        };
        return res.status(400).render("bands/createAdmin", {error: "Band name can't be longer than 50 characters", genres:contxt.items});
      });
    }
    else if((image !== undefined && !image.mimetype.startsWith('image')))
    {
      genres.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              genre: item.genre
            };
          }),
        };
        return res.status(400).render("bands/createAdmin", {error:"Upload is not a image", genres:contxt.items});
      });
    }
    else
    {
      let band;
      //replace / with ""
      genre = genre.replace(/\//g, "");
      disco = disco.replace(/\//g, "");
      bio = bio.replace(/\//g, "");
      bandname = bandname.replace(/\//g, "");
      // if image empty create band obj with standard image
      if(image === undefined)
      {
        band = new Band({
          band: bandname,
          biography: bio,
          discography: disco,
          genre: genre,
          username: req.session.username
        });
      }
      else{ //else add img to folder if not existing already and add path for new img.
        image.mv('public/images/'+image.name,function(err)
        {
          if(err)
          {
            console.log(err);
          }

        });
        var imgpath = '/images/'+image.name;
        band = new Band({
          band: bandname,
          biography: bio,
          discography: disco,
          genre: genre,
          username: req.session.username,
          imgpath:imgpath
        });
      }


      //if no err then save band obj.
      band.save().then(function() {
        req.session.flash = {
          type: "successful",
          message: "Band was created"
        };
        return res.redirect("../../genres");
      }).catch(function(error) {
        console.log(error.message);
        genres.then(function(data)
        {

          var contxt = {
            items: data.map(function(item) {
              return {
                genre: item.genre
              };
            }),
          };
          return res.status(500).render("bands/createAdmin", {error: "Something went wrong when creating band", genres:contxt.items});
        });
      });
    }
  }
  else{ //if no login redirect to root with err mess.
    req.session.flash = {
      type: "error",
      message: "Login to create a new band"
    };
    res.redirect('../../');
  }


});
//route to update band
router.route("/update/:band")
.get(function(req, res) {

  //xss filter
  let band = xss(req.params.band);
  let user = xss(req.session.username);

  if(!req.session.admin && req.session.loggedin) // if user then get update view
  {//if owner and found then show view, else send err mess.
    Band.findOne({band:band, username:user }, function(error, band) {
      if(band === null)
      {
        req.session.flash = {
          type: "error",
          message: "You don't have access to do that"
        };
        res.redirect('../../genres/bands/'+req.session.genre);
      }
      else{
        Genre.find({}, function(error, data) {

          contxt = {
            items: data.map(function(item) {
              return {
                genre: item.genre
              };
            }),
          };
          return res.render("bands/update",{id:band.band, band:band.band, discography:band.discography, biography:band.biography, genres:contxt.items, selected:band.genre});
        });

      }

    });
  }
  else if(req.session.admin && req.session.loggedin)//if admin then get update admin view.
  {//if found then show view, else send err mess.
    Band.findOne({band:band}, function(error, band) {
      if(band === null)
      {
        req.session.flash = {
          type: "error",
          message: "Couldn't find band"
        };
        res.redirect('../../genres/bands/'+req.session.genre);
      }
      else{
        Genre.find({}, function(error, data) {

          contxt = {
            items: data.map(function(item) {
              return {
                genre: item.genre
              };
            }),
          };
          return res.render("bands/updateAdmin",{id:band.band, band:band.band, discography:band.discography, biography:band.biography, genres:contxt.items, selected:band.genre});
        });

      }

    });
  }
  else{ // if no login redirect to root and send err mess.
    req.session.flash = {
      type: "error",
      message: "Login to edit band"
    };
    res.redirect('../../');
  }




}).post(function(req,res)
{
  //xss filter
  let band = xss(req.body.band);
  let user = xss(req.session.username);
  let id = xss(req.params.band);
  let bio = xss(req.body.biography);
  let disco = xss(req.body.discography);
  let genre = xss(req.body.genre);

  if(!req.session.admin && req.session.loggedin) //if user post update band
  {

    //if user is owner then find band to update else send err mess.
    Band.findOne({band:id, username:user }, function(error, data) {

      if(data === null)
      {
        req.session.flash = {
          type: "error",
          message: "You don't have access to do that"
        };
        console.log("You don't have access to do that");
        res.redirect('../../genres/'+req.session.genre);
      }
      else{
        //get genres from db as promise.
        var genres = getPromise();
        //validating fields.
        if(band === undefined || band === '' || band.length < 1)
        {
          genres.then(function(data)
          {

            var contxt = {
              items: data.map(function(item) {
                return {
                  genre: item.genre
                };
              }),
            };
            return res.status(400).render("bands/update", {error:"No input on band name", id:id, band:band, discography:disco, biography:bio, genres:contxt.items, selected:genre});
          });

        }
        else if(band.length > 50)
        {
          genres.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  genre: item.genre
                };
              }),
            };
            return res.status(400).render("bands/update", {error:"Band name can't be longer than 50 characters", id:id, band:band, discography:disco, biography:bio, genres:contxt.items, selected:genre});
          });

        }
        else if(bio === undefined || bio === '' || bio.length < 1)
        {
          genres.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  genre: item.genre
                };
              }),
            };
            return res.status(400).render("bands/update", {error:"No input on biography", id:id, band:band, discography:disco, biography:bio, genres:contxt.items, selected:genre});
          });

        }
        else if(bio.length > 3000)
        {
          genres.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  genre: item.genre
                };
              }),
            };
            return res.status(400).render("bands/update", {error:"Biography name can't be longer than 3000 characters", id:id, band:band, discography:disco, biography:bio, genres:contxt.items, selected:genre});

          });
        }
        else if(disco === undefined || disco === '' || disco.length < 1)
        {
          genres.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  genre: item.genre
                };
              }),
            };
            return res.status(400).render("bands/update", {error:"No input on discography", id:id, band:band, discography:disco, biography:bio, genres:contxt.items, selected:genre});

          });

        }
        else if(disco.length > 3000)
        {
          genres.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  genre: item.genre
                };
              }),
            };
            return res.status(400).render("bands/update", {error:"Discography can't be longer than 3000 characters", id:id, band:band, discography:disco, biography:bio, genres:contxt.items, selected:genre});
          });

        }
        else if(genre === undefined || genre === '' || genre.length < 1)
        {
          genres.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  genre: item.genre
                };
              }),
            };
            return res.status(400).render("bands/update", {error:"No input on genre", id:id, band:band, discography:disco, biography:bio, genres:contxt.items, selected:genre});

          });
        }
        else{
          //replace / with ""
          genre = genre.replace(/\//g, "");
          disco = disco.replace(/\//g, "");
          bio = bio.replace(/\//g, "");
          band = band.replace(/\//g, "");
          id = id.replace(/\//g, "");
          //update db fields to new input
          data.band = band;
          data.biography = bio;
          data.discography = disco;
          data.genre = genre;
          //if no err then save in db and redirect to most recently band in genre.
          data.save().then(function() {
            req.session.flash = {
              type: "successful",
              message: "band was updated"
            };
            return res.redirect("../../../genres/bands/"+req.session.genre);
          }).catch(function(error) {
            console.log(error.message);
            genres.then(function(data)
            {
              var contxt = {
                items: data.map(function(item) {
                  return {
                    genre: item.genre
                  };
                }),
              };
              return res.status(500).render("bands/update", {error: "Something went wrong when updating genre", id:id, band:band, discography:disco, biography:bio, genres:contxt.items, selected:genre});

            });

          });
        }


      }

    });
  }
  else if(req.session.admin && req.session.loggedin) //if admin then update band with new img if want to
  {
    //assign to var
    var image = req.files.imgFile;
    //finding band to update.
    Band.findOne({band:id}, function(error, data) {

      if(data === null)
      {
        req.session.flash = {
          type: "error",
          message: "Couldn't find band"
        };
        res.redirect('../../genres/'+req.session.genre);
      }
      else{

        var genres = getPromise();
        //validating fields.
        if(band === undefined || band === '' || band.length < 1)
        {
          genres.then(function(data)
          {

            var contxt = {
              items: data.map(function(item) {
                return {
                  genre: item.genre
                };
              }),
            };
            return res.status(400).render("bands/updateAdmin", {error:"No input on band name", id:id, band:band, discography:disco, biography:bio, genres:contxt.items, selected:genre});
          });

        }
        else if(band.length > 50)
        {
          genres.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  genre: item.genre
                };
              }),
            };
            return res.status(400).render("bands/updateAdmin", {error:"Band name can't be longer than 50 characters", id:id, band:band, discography:disco, biography:bio, genres:contxt.items, selected:genre});
          });

        }
        else if(bio === undefined || bio === '' || bio.length < 1)
        {
          genres.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  genre: item.genre
                };
              }),
            };
            return res.status(400).render("bands/updateAdmin", {error:"No input on biography", id:id, band:band, discography:disco, biography:bio, genres:contxt.items, selected:genre});
          });

        }
        else if(bio.length > 3000)
        {
          genres.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  genre: item.genre
                };
              }),
            };
            return res.status(400).render("bands/updateAdmin", {error:"Biography name can't be longer than 3000 characters", id:id, band:band, discography:disco, biography:bio, genres:contxt.items, selected:genre});

          });
        }
        else if(disco === undefined || disco === '' || disco.length < 1)
        {
          genres.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  genre: item.genre
                };
              }),
            };
            return res.status(400).render("bands/updateAdmin", {error:"No input on discography", id:id, band:band, discography:disco, biography:bio, genres:contxt.items, selected:genre});

          });

        }
        else if(disco.length > 3000)
        {
          genres.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  genre: item.genre
                };
              }),
            };
            return res.status(400).render("bands/updateAdmin", {error:"Discography can't be longer than 3000 characters", id:id, band:band, discography:disco, biography:bio, genres:contxt.items, selected:genre});
          });

        }
        else if(genre === undefined || genre === '' || genre.length < 1)
        {
          genres.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  genre: item.genre
                };
              }),
            };
            return res.status(400).render("bands/updateAdmin", {error:"No input on genre", id:id, band:band, discography:disco, biography:bio, genres:contxt.items, selected:genre});

          });
        }//if image is not an image then send err mess and render view.
        else if((image !== undefined && !image.mimetype.startsWith('image')))
        {
          genres.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  genre: item.genre
                };
              }),
            };
            return res.status(400).render("bands/updateAdmin", {error:"Upload is not a image", id:id, band:band, discography:disco, biography:bio, genres:contxt.items, selected:genre});

          });
        }
        else{

          //replace / with ""
          genre = genre.replace(/\//g, "");
          disco = disco.replace(/\//g, "");
          bio = bio.replace(/\//g, "");
          band = band.replace(/\//g, "");
          id = id.replace(/\//g, "");
          //if new image then add to folder and set img path.
          if(image)
          {
            image.mv('public/images/'+image.name,function(err)
            {
              if(err)
              {
                console.log(err);
              }

            });
            data.imgpath ='/images/'+image.name;
          }
          //update db fields.
          data.band = band;
          data.biography = bio;
          data.discography = disco;
          data.genre = genre;
          //if no err then save in db.
          data.save().then(function() {
            req.session.flash = {
              type: "successful",
              message: "band was updated"
            };
            return res.redirect("../../../genres/bands/"+req.session.genre);
          }).catch(function(error) {
            console.log(error.message);
            genres.then(function(data)
            {
              var contxt = {
                items: data.map(function(item) {
                  return {
                    genre: item.genre
                  };
                }),
              };

              return res.status(500).render("bands/updateAdmin", {error: "Something went wrong when updating genre", id:id, band:band, discography:disco, biography:bio, genres:contxt.items, selected:genre});

            });

          });
        }


      }

    });
  }
  else{ //send to root if no login.
    req.session.flash = {
      type: "error",
      message: "Login to edit genre"
    };
    res.redirect('../../');
  }
});
//route to delete band
router.route("/delete/:band")
.get(function(req, res) {

  //xss filter
  let band = xss(req.params.band);
  let user = xss(req.session.username);

  if(!req.session.admin && req.session.loggedin) //if user then find band to remove
  {
    //if not found in db then probably not the owner of the band.
    Band.findOne({band:band, username:user }, function(error, data) {

      if(data === null)
      {
        req.session.flash = {
          type: "error",
          message: "You don't have access to do that"
        };
        res.redirect('../../../genres/bands/'+req.session.genre);
      }
      else{
        return res.render("bands/delete",{id:band});
      }

    });
  }
  else if(req.session.admin && req.session.loggedin) //if admin then try to get view.
  { //if band found then render view.
    Band.findOne({band:band}, function(error, data) {

      if(data === null)
      {
        req.session.flash = {
          type: "error",
          message: "Couldn't find band"
        };
        res.redirect('../../../genres/bands/'+req.session.genre);
      }
      else{
        return res.render("bands/delete",{id:band});
      }

    });
  }
  else{//redirect to root if no login.
    req.session.flash = {
      type: "error",
      message: "Login to delete band"
    };
    res.redirect('../../../');
  }




}).post(function(req,res)
{
  //assign to vars and xss filter bad chars.
  let band = xss(req.body.band);
  let user = xss(req.session.username);
  let id = xss(req.params.band);

  if(!req.session.admin && req.session.loggedin) //if user then try to delete band
  {
    //if found in db by user then remove else send err mess.
    Band.findOne({band:id, username:user }, function(error, data) {

      if(data === null)
      {

        req.session.flash = {
          type: "error",
          message: "You don't have access to do that"
        };
        res.redirect('../../../genres/bands/'+req.session.genre);
      }
      else{
        //find and remove band if no err in db.
        Band.findOneAndRemove({band: data.band}).exec().then(function()
        {
          req.session.flash = {
            type: "successful",
            message: "Band was deleted"
          };
          res.redirect("../../../genres/bands/"+req.session.genre);
        }).catch(function(err)
        {
          console.log(error.message);
          res.status(500).render("bands/delete", {error: "Something went wrong when deleting band", id:id});
        });


      }

    });
  }
  else if(req.session.admin && req.session.loggedin) // if admin then find band to remove.
  { //if found then try to remove else send err mess.
    Band.findOne({band:id}, function(error, data) {

      if(data === null)
      {

        req.session.flash = {
          type: "error",
          message: "Couldn't find band"
        };
        res.redirect('../../../genres/bands/'+req.session.genre);
      }
      else{
        //if no err in db then find and remove band.
        Band.findOneAndRemove({band: data.band}).exec().then(function()
        {
          req.session.flash = {
            type: "successful",
            message: "Band was deleted"
          };
          res.redirect("../../../genres/bands/"+req.session.genre);
        }).catch(function(err)
        {
          console.log(error.message);
          res.status(500).render("bands/delete", {error: "Something went wrong when deleting band", id:id});
        });


      }

    });
  }
  else{//if no login then redirect to root with err mess.
    req.session.flash = {
      type: "error",
      message: "Login to delete band"
    };
    res.redirect('../../../');
  }
});
//route to render band view in genre.
router.route("/:genre")
.get(function(req, res) {
  console.log("in band view");
  if(!req.session.loggedin) // if no login then redirect to root and send err mess.
  {
    req.session.flash = {
      type: "error",
      message: "Login to show bands in genre"
    };
    res.redirect("../../");

  }
  else {
    //xss filter
    let genre = xss(req.params.genre);

    //set last visited band in genre in session, to be used when doing redirects to find right view.
    req.session.genre = genre;
    //find bands in genre in db. Then render view with band details.
    Band.find({genre:genre}, function(error, data) {

      var contxt = {
        items: data.map(function(item) {
          return {

            band: item.band,
            discography:item.discography,
            biography:item.biography,
            imgpath:item.imgpath

          };
        }),
      };
      res.render("bands/index", {bands:contxt.items});
    });

  }
});
//func to get genres from db as promise.
function getPromise(){
  var promise = Genre.find({}).exec();
  return promise;
}
//export router.
module.exports = router;
