var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Root Route
router.get("/", function(req, res){
	res.render("landing");
});

//AUTH ROUTES

//show registration form
router.get("/register", function(req, res){
	res.render("register");
});

//handle signup logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to The Camp Site! Enjoy your stay, " + user.username + ".");
			res.redirect("/campgrounds");
		});
	});
});

//Login Form
router.get("/login", function(req, res){
	res.render("login");
});

//handle login logic
router.post("/login", passport.authenticate("local",
	{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
	}), function(req, res){
	//log in logic happens here, but we use middleware as well
	
});

//LOG OUT ROUTE
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged Out Successfully!");
	res.redirect("/campgrounds");
});

module.exports = router;