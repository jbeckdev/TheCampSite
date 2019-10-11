var express				= require("express");
var app					= express();
var bodyParser 			= require("body-parser");
var mongoose 			= require("mongoose");
var flash				= require("connect-flash");
var passport			= require("passport");
var LocalStrategy		= require("passport-local");
var methodOverride 		= require("method-override");
var Campground 			= require("./models/campground");
var Comment 			= require("./models/comment");
var User 				= require("./models/user");
var seedDB 				= require("./seeds");



//Requiring Routes
var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	indexRoutes 		= require("./routes/index");

//Mongoose Config
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://localhost/the_camp_site");

app.use(methodOverride("_method"));
app.use(flash());


// seedDB();


//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "Tibi and Julia",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(3001, process.env.IP, function(){
	console.log("The Camp Site server is running.");
});