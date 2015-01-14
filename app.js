var express     = require('express'),
    app         = express(),
    routes      = require('./route/route'),
    bodyParser  = require('body-parser'),
    morgan      = require("morgan"),
    mongoose    = require("mongoose"),
    jwt         = require("jsonwebtoken");

app.use(bodyParser.urlencoded({extend:true}));

// var logger = require('morgan');
// app.use(logger('dev'));

var allowAllHits = function(request, response, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};

var User = require('./app/model/user');
var Post = require('./app/model/post');
var Comment = require('./app/model/comment');

app.get('/', function(req, res){
  res.send('Hello People');
});
app.use('/apis', routes);
app.get('/', function(request, response){
  response.redirect('/apis');
});

var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log('listening on port 3000');
});