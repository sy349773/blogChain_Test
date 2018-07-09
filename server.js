/**
* External dependecies
*/
var express = require("express");
var app = express(); //initalizes express...
var sanitazer  = require("body-parser");
var mongoose = require("mongoose");
var authentication  = require("passport");
var cookieParser = require("cookie-parser"); //Not longer needed with express-session but we may have to use it with flash once deployed...
var LocalStrategy = require("passport-local"); //Authentifcation..
var flash = require("connect-flash"); // flash message
var session = require("express-session");
var methodOverride = require("method-override"); // Delete and Put

/**
*Local Dependecies for models... models refere to the database models
*/
var Blogs  = require("./models/blogs");
var Comments     = require("./models/comments");
var User        = require("./models/user");
//var middlewares = require("./middleware/index");
/**
*NOTE: WE NEED TO CREATE ONE MODEL FOR EACH CURRENCY FOR THE TWEET IDEA...
*/
/**
*Local Dependecies for Routing
*/
var commentsRouting   = require("./routes/comments");
var blogsRouting = require("./routes/blogs");
var indexRouting      = require("./routes/index");

/**
*DATABASE CONNECTIVITY
*/
const connectionString = 'mongodb://test:cloudtest1@ds163630.mlab.com:63630/cloud_a2';
mongoose.connect(connectionString, function(err) {
    if (err) {console.log(err);}
    else{console.log("Database connected");}
});

/**
*Allows the the app to use dependencies as soon as the client makes a request.
*/
app.use(sanitazer.urlencoded({extended: true})); //sanitazes user input
app.set("view engine", "ejs"); // sets the view engine
app.use(express.static(__dirname + "/public")); //allows access to static files (css or js)
app.use(methodOverride('_method')); // Allows RESTful Delete and Put operations
app.use(cookieParser('blogchain'));
app.use(flash()); // Flash for messages

//require moment for the time
app.locals.moment = require('moment');

/**
* Stores information for each session... important for authentication
* All these variables need to be initialized...
* Ref: https://nodewebapps.com/2017/06/18/how-do-nodejs-sessions-work/
*/
app.use(require("express-session")({
    secret: "blogchain",
    resave: false,
    saveUninitialized: false
}));

/**
*PASSPORT CONFIGURATION
* Ref:  //ref https://github.com/jaredhanson/passport-local and http://www.passportjs.org/docs/authenticate/
*/
app.use(authentication.initialize()); // initializes passport...
app.use(authentication.session()); // adds session to passport
authentication.use(new LocalStrategy(User.authenticate())); // Local strategy => Name and password only
authentication.serializeUser(User.serializeUser()); // This has to be done for whatever reason
authentication.deserializeUser(User.deserializeUser());

/**
* This is the first function that the app reads as long as we get any request
* By addint this function here all request will have the error and success
*message in the requeses and respondse which is useful for the ejs file.
*/
app.use(function(req, res, next){
   res.locals.currentUser = req.user; // gets the user of the request
   res.locals.success = req.flash('success'); // Mak
   res.locals.error = req.flash('error');
   next();
});

//app.use("middlewares");
/**
* Routes for clients
*/
app.use("/", indexRouting);
//app.use(app.indexRouting);
//indexRouting.initialize(app);
app.use("/blogs", blogsRouting);
app.use("/blogs/:id/comments", commentsRouting);


//app.use(function(err, req, res, next) {});

/**
*Local...connection should change to the function below once deployed...
*/
app.listen(8000, function(){
   console.log("Connected... PORT: 8000");
});

/**
* Dynamic connection... once deployed...
*/
// app.listen(process.env.PORT, process.env.IP, function(){
//    console.log("The YelpCamp Server Has Started!");
// });
