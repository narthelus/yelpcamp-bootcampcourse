const express = require("express"),
  router = express.Router(),
  Campground = require("../models/campground"),
  middleware = require("../middleware");

// INDEX - show all campgrounds
router.get("/", (req, res) => {
  // Get all campgrounds from db
  Campground.find({}, (err, allCampgrounds) => {
    err
      ? console.log(err)
      : res.render("campgrounds/index", {
          campgrounds: allCampgrounds,
          currentUser: req.user,
          page: "campgrounds"
        });
  });
  //
});

// CREATE - add new campground to db
router.post("/", middleware.isLoggedIn, (req, res) => {
  let name = req.body.name;
  let price = req.body.price;
  let image = req.body.image;
  let desc = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  let newCampground = {
    name: name,
    price: price,
    image: image,
    description: desc,
    author: author
  };
  // Create a new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    err ? console.log(err) : res.redirect("campgrounds");
  });
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", (req, res) => {
  //find the campground with provided ID
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err || !foundCampground) {
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

// EDIT - edits campground info
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

// UPDATE - updates campground info
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (err, updatedCampground) => {
      err
        ? res.redirect("/campgrounds")
        : res.redirect("/campgrounds/" + req.params.id);
    }
  );
});

// DESTROY - deletes campground
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, err => {
    err ? res.redirect("/campgrounds") : res.redirect("/campgrounds");
  });
});

module.exports = router;
