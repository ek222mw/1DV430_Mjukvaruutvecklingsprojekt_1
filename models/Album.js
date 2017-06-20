/*jshint esversion:6*/
let mongoose = require("mongoose");

let albumSchema = mongoose.Schema({
  album: { type: String, required: true, unique:true },
  biography: {type: String, required: true},
  participant: {type: String, required: true},
  username: {type: String, required: true},
  band: {type: String, required: true},
  imgpath:{type: String, required: true, default:'/images/album.jpg'}
});


let Album = mongoose.model("Album", albumSchema);
module.exports = Album;
