/*jshint esversion:6 */
let router = require("express").Router(); //using router function in express lib.
let xss = require('xss');
let Band = require("../models/Band");
let Genre = require("../models/Genre");
let Album = require("../models/Album");
let Rating = require("../models/Rating");


//route to create album
router.route("/create")
.get(function(req, res) {
  if(!req.session.loggedin)   //if not logged in then redirect to route.
  {
    req.session.flash = {
      type: "error",
      message: "Login to create new album"
    };
    res.redirect("../../../");

  }
  else if(req.session.admin && req.session.loggedin) //if admin set then show admin create album view.
  {
    Band.find({}, function(error, data) {

      var contxt = {
        items: data.map(function(item) {
          return {
            band: item.band
          };
        }),
      };
      res.render("albums/createAdmin", {bands:contxt.items});
    });
  }
  else { // if logged in show create album view.
    Band.find({}, function(error, data) {

      var contxt = {
        items: data.map(function(item) {
          return {
            band: item.band
          };
        }),
      };
      res.render("albums/create", {bands:contxt.items});
    });

  }
}).post(function(req,res)
{

  if(!req.session.admin && req.session.loggedin) //if logged in as user
  {
    let album = xss(req.body.album);
    let bio = xss(req.body.biography);
    let participant = xss(req.body.participant);
    let band = xss(req.body.band);

    //get promise from bands in db.
    var bands = getPromise();

    if(album === undefined || album === '' || album.length < 1) //check if album is empty
    {
      bands.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              band: item.band
            };
          }),
        };
        return res.status(400).render("albums/create", {error: "No input on album name", bands:contxt.items});
      });

    }
    else if(album.length > 50) //check if album length is longer than 50 characters
    {
      bands.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              band: item.band
            };
          }),
        };
        return res.status(400).render("albums/create", {error: "Album name can't be longer than 50 characters", bands:contxt.items});
      });
    }
    else if(participant === undefined || participant === '' || participant.length < 1)
    {
      bands.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              band: item.band
            };
          }),
        };
        return res.status(400).render("albums/create", {error: "No input on participants", bands:contxt.items});
      });
    }
    else if(participant.length > 3000)
    {
      bands.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              band: item.band
            };
          }),
        };
        return res.status(400).render("albums/create", {error: "Participants can't be longer than 3000 characters", bands:contxt.items});
      });
    }
    else if(bio === undefined || bio === '' || bio.length < 1)
    {
      bands.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              band: item.band
            };
          }),
        };
        return res.status(400).render("albums/create", {error: "No input on biography", bands:contxt.items});
      });
    }
    else if( bio.length > 3000)
    {
      bands.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              band: item.band
            };
          }),
        };
        return res.status(400).render("albums/create", {error: "Biography name can't be longer than 3000 characters", bands:contxt.items});
      });
    }
    else if(band === undefined || band === '' || band.length < 1)
    {
      bands.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              band: item.band
            };
          }),
        };
        return res.status(400).render("albums/create", {error: "No input on band", bands:contxt.items});
      });
    }
    else if(band.length > 50)
    {
      bands.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              band: item.band
            };
          }),
        };
        return res.status(400).render("albums/create", {error: "Band name can't be longer than 50 characters", bands:contxt.items});
      });
    }
    else
    {
      //replace / with ""
      album = album.replace(/\//g, "");
      bio = bio.replace(/\//g, "");
      participant = participant.replace(/\//g, "");
      band = band.replace(/\//g, "");

      //input valid now create new album with details in db.
      let albumObj = new Album({
        album: album,
        biography: bio,
        participant: participant,
        band: band,
        username: req.session.username
      });
      //save album in db if not database problems as validation errors. A example: album already exists.
      albumObj.save().then(function() {
        req.session.flash = {
          type: "successful",
          message: "Album was created"
        };
        return res.redirect("../../../genres/");
      }).catch(function(error) {
        console.log(error.message);
        bands.then(function(data)
        {

          var contxt = {
            items: data.map(function(item) {
              return {
                band: item.band
              };
            }),
          };
          return res.status(500).render("albums/create", {error: "Something went wrong when creating album", bands:contxt.items});
        });
      });
    }

  }
  else if(req.session.admin && req.session.loggedin) // if logged in as admin
  {
    let album = xss(req.body.album);
    let bio = xss(req.body.biography);
    let participant = xss(req.body.participant);
    let band = xss(req.body.band);
    let image = req.files.imgFile;

    //get promise from bands in db.
    let bands = getPromise();
    //validating fields
    if(album === undefined || album === '' || album.length < 1)
    {
      bands.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              band: item.band
            };
          }),
        };
        return res.status(400).render("albums/createAdmin", {error: "No input on album name", bands:contxt.items});
      });
    }
    else if(album.length > 50)
    {
      bands.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              band: item.band
            };
          }),
        };
        return res.status(400).render("albums/createAdmin", {error: "Album name can't be longer than 50 characters", bands:contxt.items});
      });
    }
    else if(participant === undefined || participant === '' || participant.length < 1)
    {
      bands.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              band: item.band
            };
          }),
        };
        return res.status(400).render("albums/createAdmin", {error: "No input on participants", bands:contxt.items});
      });
    }
    else if(participant.length > 3000)
    {
      bands.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              band: item.band
            };
          }),
        };
        return res.status(400).render("albums/createAdmin", {error: "Participants can't be longer than 3000 characters", bands:contxt.items});
      });
    }
    else if(bio === undefined || bio === '' || bio.length < 1)
    {
      bands.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              band: item.band
            };
          }),
        };
        return res.status(400).render("albums/createAdmin", {error: "No input on biography", bands:contxt.items});
      });
    }
    else if( bio.length > 3000)
    {
      bands.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              band: item.band
            };
          }),
        };
        return res.status(400).render("albums/createAdmin", {error: "Biography name can't be longer than 3000 characters", bands:contxt.items});
      });
    }
    else if(band === undefined || band === '' || band.length < 1)
    {
      bands.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              band: item.band
            };
          }),
        };
        return res.status(400).render("albums/createAdmin", {error: "No input on band", bands:contxt.items});
      });
    }
    else if(band.length > 50)
    {
      bands.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              band: item.band
            };
          }),
        };
        return res.status(400).render("albums/createAdmin", {error: "Band name can't be longer than 50 characters", bands:contxt.items});
      });
    }
    else if((image !== undefined && !image.mimetype.startsWith('image'))) //checking if image is a image else send error view
    {
      bands.then(function(data)
      {

        var contxt = {
          items: data.map(function(item) {
            return {
              band: item.band
            };
          }),
        };
        return res.status(400).render("albums/createAdmin", {error:"Upload is not a image", bands:contxt.items});
      });
    }
    else
    {
      //replace / with ""
      album = album.replace(/\//g, "");
      bio = bio.replace(/\//g, "");
      participant = participant.replace(/\//g, "");
      band = band.replace(/\//g, "");

      let albumObj;
      if(image === undefined) //if no image create album with standard image.
      {
        albumObj = new Album({
          album: album,
          biography: bio,
          participant: participant,
          band: band,
          username: req.session.username
        });
      }
      else{
        image.mv('public/images/'+image.name,function(err) //move image to public/images folder
        {
          if(err)
          {
            console.log(err);
          }

        });
        var imgpath = '/images/'+image.name;
        albumObj = new Album({
          album: album,
          biography: bio,
          participant: participant,
          band: band,
          username: req.session.username,
          imgpath:imgpath
        });
      }

      albumObj.save().then(function() { //save album
        req.session.flash = {
          type: "successful",
          message: "Album was created"
        };
        return res.redirect("../../../genres/");
      }).catch(function(error) {
        console.log(error.message);
        bands.then(function(data)
        {

          var contxt = {
            items: data.map(function(item) {
              return {
                band: item.band
              };
            }),
          };
          return res.status(500).render("albums/createAdmin", {error: "Something went wrong when creating album", bands:contxt.items});
        });
      });
    }
  }
  else{ //if not loggedin redirect to root.
    req.session.flash = {
      type: "error",
      message: "Login to create a new album"
    };
    res.redirect('../../../');
  }


});
//route to update album.
router.route("/update/:album")
.get(function(req, res) {


  let album = xss(req.params.album);
  let user = xss(req.session.username);
  //if logged in as user show update album view
  if(!req.session.admin && req.session.loggedin)
  {
    Album.findOne({album:album, username:user }, function(error, album) {
      if(album === null)
      {
        req.session.flash = {
          type: "error",
          message: "You don't have access to do that"
        };
        res.redirect('./../../.././bands/albums/'+req.session.band);
      }
      else{
        Band.find({}, function(error, data) {

          contxt = {
            items: data.map(function(item) {
              return {
                band: item.band
              };
            }),
          };
          return res.render("albums/update",{id:album.album, album:album.album, participant:album.participant, biography:album.biography, bands:contxt.items, selected:album.band});
        });

      }

    });
  }
  else if(req.session.admin && req.session.loggedin) //if logged in as admin then show update admin view.
  {
    Album.findOne({album:album}, function(error, album) {
      if(album === null)
      {
        req.session.flash = {
          type: "error",
          message: "Couldn't find album"
        };
        res.redirect('./../../.././bands/albums/'+req.session.band);
      }
      else{
        Band.find({}, function(error, data) {

          contxt = {
            items: data.map(function(item) {
              return {
                band: item.band
              };
            }),
          };
          return res.render("albums/updateAdmin",{id:album.album, album:album.album, participant:album.participant, biography:album.biography, bands:contxt.items, selected:album.band});
        });

      }

    });
  }
  else{ //if not logged in redirect to root and send flash message
    req.session.flash = {
      type: "error",
      message: "Login to edit band"
    };
    res.redirect('../../');
  }




}).post(function(req,res)
{
  let band = xss(req.body.band);
  let user = xss(req.session.username);
  let id = xss(req.params.album);
  let bio = xss(req.body.biography);
  let parti = xss(req.body.participant);
  let album = xss(req.body.album);

  if(!req.session.admin && req.session.loggedin) // if logged in as user
  {

    //find album in db
    Album.findOne({album:id, username:user }, function(error, data) {

      if(data === null)
      {
        req.session.flash = {
          type: "error",
          message: "You don't have access to do that"
        };
        res.redirect('./../../.././bands/albums/'+req.session.band);
      }
      else{
        //get promise from bands in db.
        var bands = getPromise();
        //validating fields
        if(album === undefined || album === '' || album.length < 1)
        {
          bands.then(function(data)
          {

            var contxt = {
              items: data.map(function(item) {
                return {
                  band: item.band
                };
              }),
            };
            return res.status(400).render("albums/update", {error:"No input on album name", id:id, album:album, participant:parti, biography:bio, bands:contxt.items, selected:band});
          });

        }
        else if(album.length > 50)
        {
          bands.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  band: item.band
                };
              }),
            };
            return res.status(400).render("albums/update", {error:"Album name can't be longer than 50 characters", id:id, album:album, participant:parti, biography:bio, bands:contxt.items, selected:band});
          });

        }
        else if(bio === undefined || bio === '' || bio.length < 1)
        {
          bands.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  band: item.band
                };
              }),
            };
            return res.status(400).render("albums/update", {error:"No input on biography", id:id, album:album, participant:parti, biography:bio, bands:contxt.items, selected:band});
          });

        }
        else if(bio.length > 3000)
        {
          bands.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  band: item.band
                };
              }),
            };
            return res.status(400).render("albums/update", {error:"Biography name can't be longer than 3000 characters", id:id, album:album, participant:parti, biography:bio, bands:contxt.items, selected:band});

          });
        }
        else if(parti === undefined || parti === '' || parti.length < 1)
        {
          bands.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  band: item.band
                };
              }),
            };
            return res.status(400).render("albums/update", {error:"No input on participants", id:id, album:album, participant:parti, biography:bio, bands:contxt.items, selected:band});

          });

        }
        else if(parti.length > 3000)
        {
          bands.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  band: item.band
                };
              }),
            };
            return res.status(400).render("albums/update", {error:"Participants can't be longer than 3000 characters", id:id, album:album, participant:parti, biography:bio, bands:contxt.items, selected:band});
          });

        }
        else if(band === undefined || band === '' || band.length < 1)
        {
          bands.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  band: item.band
                };
              }),
            };
            return res.status(400).render("albums/update", {error:"No input on band", id:id, album:album, participant:parti, biography:bio, bands:contxt.items, selected:band});

          });
        }
        else{
          //replace / with ""
          album = album.replace(/\//g, "");
          bio = bio.replace(/\//g, "");
          parti = parti.replace(/\//g, "");
          band = band.replace(/\//g, "");

          //update fields in db.
          data.album = album;
          data.biography = bio;
          data.participant = parti;
          data.band = band;
          //trying to save in db.
          data.save().then(function() {
            req.session.flash = {
              type: "successful",
              message: "Album was updated"
            };
            return res.redirect("./../../.././bands/albums/"+band);
          }).catch(function(error) { // if db error send error to view.
            console.log(error.message);
            bands.then(function(data)
            {
              var contxt = {
                items: data.map(function(item) {
                  return {
                    band: item.band
                  };
                }),
              };
              return res.status(500).render("albums/update", {error: "Something went wrong when updating album", id:id, album:album, participant:parti, biography:bio, bands:contxt.items, selected:band});

            });

          });
        }


      }

    });
  }
  else if(req.session.admin && req.session.loggedin) //Checking if logged in as admin.
  {
    var image = req.files.imgFile;
    //find album to update
    Album.findOne({album:id}, function(error, data) {
      //if null then album not found.
      if(data === null)
      {
        console.log("null");
        req.session.flash = {
          type: "error",
          message: "Couldn't find album"
        };
        res.redirect('./../../.././bands/albums/'+req.session.band);
      }
      else{
        //get bands from db as promise.
        var bands = getPromise();
        //validating fields.
        if(album === undefined || album === '' || album.length < 1)
        {
          bands.then(function(data)
          {

            var contxt = {
              items: data.map(function(item) {
                return {
                  band: item.band
                };
              }),
            };
            return res.status(400).render("albums/updateAdmin", {error:"No input on album name", id:id, album:album, participant:parti, biography:bio, bands:contxt.items, selected:band});
          });

        }
        else if(album.length > 50)
        {
          bands.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  band: item.band
                };
              }),
            };
            return res.status(400).render("albums/updateAdmin", {error:"Album name can't be longer than 50 characters", id:id, album:album, participant:parti, biography:bio, bands:contxt.items, selected:band});
          });

        }
        else if(bio === undefined || bio === '' || bio.length < 1)
        {
          bands.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  band: item.band
                };
              }),
            };
            return res.status(400).render("albums/updateAdmin", {error:"No input on biography", id:id, album:album, participant:parti, biography:bio, bands:contxt.items, selected:band});
          });

        }
        else if(bio.length > 3000)
        {
          bands.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  band: item.band
                };
              }),
            };
            return res.status(400).render("albums/updateAdmin", {error:"Biography name can't be longer than 3000 characters", id:id, album:album, participant:parti, biography:bio, bands:contxt.items, selected:band});

          });
        }
        else if(parti === undefined || parti === '' || parti.length < 1)
        {
          bands.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  band: item.band
                };
              }),
            };
            return res.status(400).render("albums/updateAdmin", {error:"No input on participants", id:id, album:album, participant:parti, biography:bio, bands:contxt.items, selected:band});

          });

        }
        else if(parti.length > 3000)
        {
          bands.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  band: item.band
                };
              }),
            };
            return res.status(400).render("albums/updateAdmin", {error:"Participants can't be longer than 3000 characters", id:id, album:album, participant:parti, biography:bio, bands:contxt.items, selected:band});
          });

        }
        else if(band === undefined || band === '' || band.length < 1)
        {
          bands.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  band: item.band
                };
              }),
            };
            return res.status(400).render("albums/updateAdmin", {error:"No input on band", id:id, album:album, participant:parti, biography:bio, bands:contxt.items, selected:band});

          });
        } //checking if upload is a image else send error to view.
        else if((image !== undefined && !image.mimetype.startsWith('image')))
        {
          bands.then(function(data)
          {
            var contxt = {
              items: data.map(function(item) {
                return {
                  band: item.band
                };
              }),
            };
            return res.status(400).render("albums/updateAdmin", {error:"Upload is not a image", id:id, album:album, participant:parti, biography:bio, bands:contxt.items, selected:band});

          });
        }
        else{
          //if image not empty then update path and move to folder.
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
          //replace / with ""
          album = album.replace(/\//g, "");
          bio = bio.replace(/\//g, "");
          parti = parti.replace(/\//g, "");
          band = band.replace(/\//g, "");
          //updaing fields.
          data.album = album;
          data.biography = bio;
          data.participant = parti;
          data.band = band;
          //try to save in db.
          data.save().then(function() {
            req.session.flash = {
              type: "successful",
              message: "Album was updated"
            };
            return res.redirect("./../../.././bands/albums/"+band);
          }).catch(function(error) {
            console.log(error.message);
            bands.then(function(data)
            {
              var contxt = {
                items: data.map(function(item) {
                  return {
                    band: item.band
                  };
                }),
              };
              return res.status(500).render("albums/updateAdmin", {error: "Something went wrong when updating album", id:id, album:album, participant:parti, biography:bio, bands:contxt.items, selected:band});

            });

          });
        }


      }

    });
  }
  else{ //if not logged in send flash message and redirect to root of app.
    req.session.flash = {
      type: "error",
      message: "Login to edit album"
    };
    res.redirect('../../../../');
  }
});
//path route to delete album
router.route("/delete/:album")
.get(function(req, res) {

  //xss filter bad characters.
  let album = xss(req.params.album);
  let user = xss(req.session.username);

  if(!req.session.admin && req.session.loggedin)//if logged in as user then find album.
  {
    //trying to find album in db, if not found then probably not got access to delete.
    Album.findOne({album:album, username:user }, function(error, data) {

      if(data === null)
      {
        req.session.flash = {
          type: "error",
          message: "You don't have access to do that"
        };
        res.redirect('./../../.././bands/albums/'+req.session.band);
      }
      else{
        return res.render("albums/delete",{id:album});
      }

    });
  }
  else if(req.session.admin && req.session.loggedin) // check if logged in as admin.
  { //if not found then not exist.
    Album.findOne({album:album}, function(error, data) {

      if(data === null)
      {
        req.session.flash = {
          type: "error",
          message: "Couldn't find album"
        };
        res.redirect('./../../.././bands/albums/'+req.session.band);
      }
      else{
        return res.render("albums/delete",{id:album});
      }

    });
  }
  else{//redirect if not logged in.
    req.session.flash = {
      type: "error",
      message: "Login to delete album"
    };
    res.redirect('../../../../');
  }




}).post(function(req,res)
{ //xss filter
  let album = xss(req.body.album);
  let user = xss(req.session.username);
  let id = xss(req.params.album);

  if(!req.session.admin && req.session.loggedin) // if logged in as user
  {
    //if null then not got access or not exists.
    Album.findOne({album:id, username:user }, function(error, data) {

      if(data === null)
      {

        req.session.flash = {
          type: "error",
          message: "You don't have access to do that"
        };
        res.redirect('./../../.././bands/albums/'+req.session.band);
      }
      else{
        //if not null then find and remove.
        Album.findOneAndRemove({album: data.album}).exec().then(function()
        {
          req.session.flash = {
            type: "successful",
            message: "Album was deleted"
          };
          res.redirect("./../../.././bands/albums/"+req.session.band);
        }).catch(function(err)
        {
          console.log(error.message);
          res.status(500).render("albums/delete", {error: "Something went wrong when deleting album", id:id});
        });


      }

    });
  }
  else if(req.session.admin && req.session.loggedin) //if logged in as admin.
  { //if album not found then not existing anymore.
    Album.findOne({album:id}, function(error, data) {

      if(data === null)
      {

        req.session.flash = {
          type: "error",
          message: "Couldn't find album"
        };
        res.redirect('./../../.././bands/albums/'+req.session.band);
      }
      else{
        //if not null then find and remove.
        Album.findOneAndRemove({album: data.album}).exec().then(function()
        {
          req.session.flash = {
            type: "successful",
            message: "Album was deleted"
          };
          res.redirect("./../../.././bands/albums/"+req.session.band);
        }).catch(function(err)
        {
          console.log(error.message);
          res.status(500).render("albums/delete", {error: "Something went wrong when deleting album", id:id});
        });


      }

    });
  }
  else{
    //if not logged in then redirect to root and send error flash message.
    req.session.flash = {
      type: "error",
      message: "Login to delete band"
    };
    res.redirect('../../../../');
  }
});
//route to find albums with certain band.
router.route("/:band")
.get(function(req, res) {
  if(!req.session.loggedin) // if not logged in then redirect to root and send error message.
  {
    req.session.flash = {
      type: "error",
      message: "Login to show albums of band"
    };
    res.redirect("../../../../");

  }
  else {
    let band = xss(req.params.band);
    req.session.band = band; // set session to recently visited band so when doing redirect then find recent band withing albums
    //find all albums within picked band and render view.
    Album.find({band:band}, function(error, data) {

      var contxt = {
        items: data.map(function(item) {
          return {

            album: item.album,
            biography:item.biography,
            participant:item.participant,
            imgpath:item.imgpath

          };
        }),
      };
      res.render("albums/index", {albums:contxt.items});
    });

  }
});
//func to transform band into promise band.
function getPromise(){
  var promise = Band.find({}).exec();
  return promise;
}
//export router
module.exports = router;
