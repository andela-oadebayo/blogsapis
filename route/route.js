//The required packages
var express     = require('express');
var router      = express.Router();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var jwt         = require('jsonwebtoken');
var User        = require('../app/model/user');
var Post        = require('../app/model/post');
var Comment     = require('../app/model/comment');
require('../config/db.js');

//this functioin will help to continue request on endpoints
function ensureAuthorized(request, response, next){
  var bearerToken;
  var bearerHeader = request.headers['authorization'];
  if(typeof bearerHeader !== 'undefined'){
    var bearer = bearerHeader.split(' ');
    bearerToken = bearer[1];
    request.token = bearerToken;
    next();
  }else{         
    response.send(403);
  }
};

process.on('uncaughtException', function(err){
  console.log(err);
});


//Routes to view All post
router.route('/')
  .get(function(request, response){
    Post.find({}, function(err, data){
      if(err){
        response.send(err);
      }
      response.json(data);
    });
  });

//Routes To view All the User
router.route('/users')
  .get(function(request,response){
    User.find({},'lname fname nickname password token email -_id', function(err, data){
      if(err){
        response.send(err);
      }
      response.json(data);
    });
  });

//Routes to craete a new devil
router.route('/article/post')
  .post(ensureAuthorized, function(request, response){
    User.findOne({token:request.token}, function(err, user){
      if(err){
        response.send(err);
      }else{
        var articleData = {
          title  : request.body.title,
          tags   : request.body.tags,
          body   : request.body.body,
          author : user._id
        };
        Post.create(articleData, function(err, articleData){
          if(err){
            response.send(err)
          }
          response.json('New article created');
        });  
      }
    });
  });

//Routes to make to get One single post and make a Put and Delete
router.route('/article/:id')
  .get(ensureAuthorized, function(request, response){
    User.findOne({token: request.token}, function(err, user){
      console.log(request.token);
      if(err){
         response.send(err);
      }else{
        Post.findById(request.params.id, function(err, data){
          if(err){
            response.send(err);
          }
          response.json(data);
        });
      }
    });
  })
  .put(ensureAuthorized, function(request, response){
    User.findOne({token: request.token}, function(err, user){
      console.log(request.token);
      if(err){
        response.send(err); 
      }else{
        Post.findByIdAndUpdate({_id: request.params.id}, request.body, function(err){
          if(err){
            response.send(err);
          }
          response.send("Updated");
        });
      }
    });
  })
  .delete(ensureAuthorized, function(request, response){
    User.findOne({token: request.token}, function(err, user){
      console.log(request.token);
      if(err){
        response.send(err);
        
      }else{
        Post.findByIdAndRemove(request.params.id, function(err){
          if(err){
            response.send(err);
          }
          response.send("Deleted");
        });
      }
    });
  });


//Route for login
router.route('/login')
  .post(function(request, response){
    var queryData = {
      email: request.body.email, 
      password: request.body.password
    };
    User.findOne(queryData, function(err, user){
      if(err){
        response.send(err);
      }else{
        if(user){
          response.json({
            type: true,
            data: user,
            token: user.token
          });
        }else{
          response.json('Incorrect password/email');
        }
      }
    });
  });

//Route for Signup
router.route('/signup')
  .post(function(request, response){
    var queryData = {
      email: request.body.email, 
      password: request.body.password
    };
    User.findOne(queryData, function(err, user){
      if(err){
        response.send(err);
      }else{
        if(user){
          response.json("User Already Exist");
        }else{
          var userModel = new User();
          userModel.fname = request.body.fname;
          userModel.lname = request.body.lname;
          userModel.email = request.body.email;
          userModel.nickname = request.body.nickname;
          userModel.password =  request.body.password;
          userModel.save(function(err, user){
            console.log(process.env.JWT_SECRET);
            user.token = jwt.sign(user, process.env.JWT_SECRET);
            user.save(function(err, user1){
              response.json({
                type: true,
                data: user1,
                token: user1.token
              });
            });
          });
        }
      }
    });
  });

module.exports = router;