/**
*THIS FILE CONTAINS ALL THE ROUTERS FOR SINGING IN, LOGGING IN AND LOGGING OUT
*/

/**
*Getting external dependencies
*/
var express = require("express");
var router  = express.Router();
var passport = require("passport");
/**
*Getting external local dependencies
*/
var User = require("../models/user");


/**
* Main index routes are below
*/
//Intro route
router.get("/", function(req, res){
    //res.send("hello");
    res.render("starters/intro");
});
// register form. NOTE: page is passed in the response for the dynamic header buttons
router.get("/register", function(req, res){
   res.render("starters/register", {page: 'register'});
});
//router for the post register. Handles the logic
router.post("/register", function(req, res){
    //We need to create a variable with our User model to check if it exist already
    var newUser = new User({username: req.body.username});
    // register belongs to the passports lbrary and requires the Model.
    User.register(newUser, req.body.password, function(err, user){
        if(err){  // set the flash message if error err.message
          req.flash("error",  err.message);
          return res.redirect("/register");
        } // We need to authenticate to keep the session Open and update CurrentUser from the respondse.
        passport.authenticate("local")(req, res,() => {
           req.flash("success", "Successfully Signed Up! Welcome " + req.body.username);
           res.redirect("/blogs");
        });
    });
});

//login form
router.get("/login", function(req, res){
   res.render("starters/login", {page: 'login'});
});

//router for  the post login... handles the logic
// we update the local variables after authentification
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/blogs",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome to BlogChain!'
      })
  );

// router for the logout...
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "See you soon!");
   res.redirect("/blogs");
});

//
router.get("/blogchainmain", function(re, res){
  res.render("main/blogchainmain")
});
module.exports = router;
