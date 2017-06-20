/*jshint esversion:6 */
//home route, which is triggered when start the app.

let router = require("express").Router(); //use express router.
router.route("/")
    .get(function(req, res) {
        if(!req.session.loggedin) // if no login render home/index route else redirect to genres router.
        {
          res.render("home/index");

        }
        else {
          res.redirect("../genres");
        }
    });
//export router.
module.exports = router;
