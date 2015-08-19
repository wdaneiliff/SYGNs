//CALL PACKAGES
require('dotenv').load();
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 8080;
var User = require('./models/user.js');
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');

var mongoose = require('mongoose');

//BRING IN USER ROUTE
var userRoutes = require('./config/userRoutes');

//TOKEN CONFIG
var superSecret = 'iamtherealbatman';

//CONNECT OUR DATABASE
mongoose.connect(process.env.MONGO_DB);

//USE PUBLIC FOLDER FOR ANY FILE REQUESTS
app.use(express.static(__dirname + '/public'));

//USE PUBLIC FOLDER FOR ANY FILE REQUESTS
app.use(express.static(__dirname + '/public'));

//APP congfiguration
app.use(bodyParser.urlencoded( {extended : true} ));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','Get,Post');
  res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type, Authorization');
  next();
});

//LOGGER FOR SERVER REQUESTS
app.use(morgan('dev'));

app.get('/login', function(req,res){
    res.sendfile('./views/index.html');
});

app.get('/help', function(req,res){
    res.sendfile('./views/help.html');
});

app.get('/signup', function(req,res){
  res.sendfile('./views/signup.html');
});



//ROUTE TO AUTHENTICATE A USER
app.post('/authenticate',function(req,res){
  User.findOne({email: req.body.email}).select('email firstName password').exec(function(err,user){
    if(err) throw err;

    //HANDLE IF NO USER FOUND
    if(!user){
      res.json({success: false, message: 'Invalid email', redirect: '/login'});
    } else {
      //VALIDATE PASSWORD TO MATCH USER
      var validPW = user.comparePassword(req.body.password);
      if (!validPW){
        res.json({success: false, message: 'Invalid password', redirect: '/login'});
      } else {
        //CREATE AND SEND TOKEN NOW THAT USER FOUND AND PW CLEARS
        console.log('user found and password verified, creating token..');
        var token = jwt.sign({
          email: user.email,
          firstName: user.firstName },
          superSecret,
          { expiresInMinutes: 1440 }
        );
        //RETURN RESPONSE WITH TOKEN
        res.cookie("token",token);
        res.json({success: true, message: 'enjoy your token', access_token: token, redirect: '/'});
      }
    }

  });
});

//REGISTER THE USERS ROUTE
app.use('/users', userRoutes);


//ROUTE MIDDLEWARE
app.use(function(req,res,next){
  //LOG A NEW REQ
  console.log("Someone just came to the route");

  //CHECK FOR ACTIVE TOKEN IN URL OR POST PARAMS
  var token = req.cookies.token || req.body.token || req.param('token') || req.headers['x-access-token'];

  //DECODE TOKEN
  if(token){

    //VERIFY SECRET AND CHECK TOKEN EXPIR
    jwt.verify(token, superSecret, function(err, decoded){
      if(err){
        res.status(403).send({success: false, message: 'failed to authen token'});
      } else {
        //IF TOKEN IS VALID AND ACTIVE, SAVE FOR OTHER ROUTES TO users
        req.decoded = decoded;
        next(); //MOVE ON NEXT ACTION
      }
    });
  } else {
    //IF THERE IS NO TOKEN, RETURN ACCESS FORBIDDEN RESPONSE
    return res.redirect('/login');
    // return res.status(403).send({success: false, message: 'no token provided'});
  }

});

//HOMEPAGE / MAIN MAP ROUTER
app.get('/', function(req,res){
    res.sendfile("./views/map_index.html");
});







app.get('/edit', function(req,res){
  res.sendfile('./views/edit.html');
});

//APP TO LISTEN ON PORT 8080
app.listen(port);
console.log('magic happens on port' + port);
