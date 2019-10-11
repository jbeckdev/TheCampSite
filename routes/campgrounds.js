var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX ROUTE - Displays all campgrounds on page
router.get("/campgrounds", function(req, res){
	//get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

//NEW ROUTE - displays a form for user to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//CREATE ROUTE - add new campground to database
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
	//get data from form 
	let name = req.body.name;
	let price = req.body.price;
	let image = req.body.image;
	let desc = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username,
	};
	let newCampground = {name: name, price: price, image: image, description: desc, author: author};
	//Create a new campground and save to database
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			//redirect back to campgrounds
			res.redirect("/campgrounds");
		}
	});
});

//SHOW ROUTE - Shows more info about one campground
router.get("/campgrounds/:id", function(req, res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else{
			console.log(foundCampground);
			//render the show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});

});

//EDIT CAMPGROUND ROUTE

router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwner, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//UPDATE CAMPGROUND ROUTE

router.put("/campgrounds/:id", middleware.checkCampgroundOwner, function(req, res){
	//find and update correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


//DELETE/DESTROY CAMPGROUND ROUTE

router.delete("/campgrounds/:id", middleware.checkCampgroundOwner, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});


module.exports = router;