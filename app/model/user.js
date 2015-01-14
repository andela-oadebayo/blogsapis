var mongoose = require('mongoose');

//define schema for our user model
var userSchema = new mongoose.Schema({
  fname       : {type : String},
  lname       : {type : String},
  nickname    : {type : String, unique : true},
  email       : {type : String, unique : true},
  password    : {type : String},
  created_at  : {type : Date, default : Date.now},
  token       : {type : String}
});
module.exports = mongoose.model('User', userSchema);