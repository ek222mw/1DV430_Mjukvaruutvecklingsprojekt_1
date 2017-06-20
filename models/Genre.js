/*jshint esversion:6*/
let mongoose = require("mongoose");

let genreSchema = mongoose.Schema({
  genre: { type: String, required: true, unique:true },
  username: {type: String, required: true},
  imgpath:{type: String, required: true, default:'/images/genre.jpg'}
});


let Genre = mongoose.model("Genre", genreSchema);
module.exports = Genre;
