var express= require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
  res.render("landing");
});

// ===========================
// Auth routes
// ===========================

// SHOW NEW - show register form
router.get("/register", function(req,res){
  res.render("users/register");
});

// CREATE NEW - creates a new username
router.post("/register",function(req,res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err,user){
    if(err){
      console.log(err);
      res.render("user/register");
    }else{
      passport.authenticate("local")(req,res, function(){
        res.redirect("/campgrounds");
      });
    }
  });
});

//SHOW LOGIN - show login form
router.get("/login", function(req, res){
  res.render("users/login");
});

//AUTHENTICATE USER
router.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req,res){
});

//LOGOUT
router.get("/logout", function(req,res){
  req.logout();
  res.redirect("/campgrounds");
});

// ===========================
// Auth middleware
// ===========================

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;