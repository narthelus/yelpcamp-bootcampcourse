let express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  User = require("./models/user"),
  seedDB = require("./seeds");

//Requiring Routes
const commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  indexRoutes = require("./routes/index");

//Basic Setup
mongoose.connect(
  "mongodb+srv://adminyelp:RMaf11261620$@yelpcamp-8vuln.azure.mongodb.net/yelp_camp?retryWrites=true",
  {
    useNewUrlParser: true
  }
);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB(); //seed the database

//Passport Config
app.use(
  require("express-session")({
    secret: "Shina is the cutest, bitch",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//Listen
app.listen(process.env.PORT, process.env.IP);
/*
app.listen(3000, "localhost", () => {
  console.log("Server Initialized.");
});
*/
