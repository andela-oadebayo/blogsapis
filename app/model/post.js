var mongoose = require('mongoose');
var Comment = require('./comment');
//define the schema
var postSchema = new mongoose.Schema({
  title       : {type : String},
  body        : {type : String},
  tags        : {type : String},
  author      : {type : mongoose.Schema.Types.ObjectId, ref: 'User'},
  comments    : [Comment],
  created_at  : {type : Date, default : Date.now},
  updated_at  : {type : Date}
});

module.exports = mongoose.model('Post', postSchema);
