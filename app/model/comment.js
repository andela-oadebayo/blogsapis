var mongoose = require('mongoose');

//define the schema 
var commentSchema = new mongoose.Schema({
  body        : {type : String},
  belongs_to  : {type : mongoose.Schema.Types.ObjectId, ref: 'Post'},
  response    : [{type : mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  created_at  : {type :  Date}
});

module.exports = mongoose.model('Comment', commentSchema);