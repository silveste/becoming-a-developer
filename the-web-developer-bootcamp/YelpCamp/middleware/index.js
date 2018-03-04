var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "You need to log in to do that!");
  res.redirect("/login");
};

middlewareObj.changeCampgroundAuth = function(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if (err){
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
        if (foundCampground.author.id.equals(req.user._id)){
          next();
        } else {
            req.flash("error", "You don have permissions to do that!!");
            res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to log in to do that!");
    res.redirect("back");
  }
};

middlewareObj.changeCommentAuth = function (req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if (err){
        req.flash("error", "Comment not found");
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)){
          next();
        } else {
            req.flash("error", "You don have permissions to do that!!");
            res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to log in to do that!");
    res.redirect("back");
  }
};

module.exports = middlewareObj;
