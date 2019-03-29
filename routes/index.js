const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../models/user");

//Root Route
router.get("/", (req, res) => {
  res.render("landing");
});

//Register Route
router.get("/register", (req, res) => {
  res.render("register", { page: "register" });
});

//Sign Up Form
router.post("/register", function(req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("register", { error: err.message });
    }
    passport.authenticate("local")(req, res, function() {
      req.flash(
        "success",
        "Successfully Signed Up! Nice to meet you " + req.body.username
      );
      res.redirect("/campgrounds");
    });
  });
});

//Login Route
router.get("/login", (req, res) => {
  res.render("login", { page: "login" });
});

//Login Form
router.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome back, " + user.username);
      res.redirect("/campgrounds");
    });
  })(req, res, next);
});

//Logout Route
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});

module.exports = router;
