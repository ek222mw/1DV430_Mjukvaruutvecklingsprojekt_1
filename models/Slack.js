/*jshint esversion:6*/
let mongoose = require("mongoose");

let slackSchema = mongoose.Schema({
  username: {type: String, required: true, unique:true},
  slackusername: {type: String, required: true, unique:true},
  slack: { type: Boolean, required: true, default:true }
});


let Slack = mongoose.model("Slack", slackSchema);
module.exports = Slack;
