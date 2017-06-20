/*jshint esversion:6*/
let mongoose = require("mongoose");

let ratingSchema = mongoose.Schema({
  username: {type: String, required: true},
  rating: {type: Number, required: true},
  album: { type: String, required: true}
});


let Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
