/*jshint esversion:6*/
let mongoose = require("mongoose");

let bandSchema = mongoose.Schema({
  band: { type: String, required: true, unique:true },
  discography: {type: String, required: true},
  biography: {type: String, required: true},
  username: {type: String, required: true},
  genre: {type: String, required: true},
  imgpath:{type: String, required: true, default:'/images/band.png'}
});


let Band = mongoose.model("Band", bandSchema);
module.exports = Band;
