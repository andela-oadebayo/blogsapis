var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blogs');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Cant\'t connect to the database'));
db.once('open', function(){
  console.log('connected to database');
});

var gracefulShutdown = function ( msg, callback) {
  mongoose.connection.close(function(){
    console.log("Mongoose disconnected through " + msg);
    callback();
  }); 
};

process.once('SIGUSR2', function (){
  gracefulShutdown('nodemon restart', function (){
    process.kill(process.pid, 'SIGUSR2');
  });
});

// For app termination 
process.on('SIGINT', function() { 
  gracefulShutdown('app termination', function () { 
  process.exit(0); 
  }); 
});
