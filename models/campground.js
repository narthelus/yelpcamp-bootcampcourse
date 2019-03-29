const mongoose = require("mongoose");

let campgroundSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

//Deletes comments linked to campgrounds when these are deleted
const Comment = require("./comment");
campgroundSchema.pre("remove", async function() {
  await Comment.remove({
    _id: {
      $in: this.comments
    }
  });
});

module.exports = mongoose.model("Campground", campgroundSchema);
