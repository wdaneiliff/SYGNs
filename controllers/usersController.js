var User = require('../models/user.js');
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');

//TOKEN CONFIG
var superSecret = 'iamtherealbatman';

//CREATE USER
function createUser(req,res){
  var user = new User();

  //SET USER INFO FROM REQUEST
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.password = req.body.password;

  //SAVE USER AND CHECK FOR ERRORS
  user.save(function(err){
    if(err){
      if(err.code == 11000){
        return res.json({success: false, message: 'user already exist'});
      } else{
        res.send(err);
      }
    }
    res.json({message:"successful", redirect:"/"});
  });

}

// SHOW All USERS
function getAll(req,res){
  User.find({}, function(err, users){
    if(err) res.send(err);
    res.json(users);
  });
}


//GET AND SHOW INDIVIDUAL USER
function showUser(req,res){
  console.log("individual user requested");

  var token = req.cookies.token || req.body.token || req.param('token') || req.headers['x-access-token'];
  var decode;

  if(token){

    //VERIFY SECRET AND CHECK TOKEN EXPIR
    jwt.verify(token, superSecret, function(err, decoded){
      if(err){
        res.status(403).send({success: false, message: 'failed to authen token'});
      } else {
        //IF TOKEN IS VALID AND ACTIVE, SAVE FOR OTHER ROUTES TO users
        req.decoded = decoded;
        decode = decoded;
        console.log(decode.email + "$$$$$");
      }

      User.findOne({email: decode.email}, function(err, user){
        if(err) res.send(err);
        console.log(user);
        res.json(user);
      });
    });
  }
}

//UPDATE INDIVIDUAL USER
function updateUser(req,res){
  console.log("edit individual user requested");

  User.findOne({email: req.decoded.email}, function(err, user){

    console.log('found him');
    console.log(req.decoded.email);
    if(err) res.send(err);

    //UPDATE USER PARAMETERS ONLY IF PROVIDED
    if(req.body.firstName) user.firstName = req.body.firstName;
    if(req.body.lastName) user.lastName = req.body.lastName;
    if(req.body.email) user.email = req.body.email;
    if(req.body.password) user.password = req.body.password;

    user.save(function(err){
      if(err) res.send(err);
      res.json({message: 'successfully updated', redirect:"/edit"});
    });
  });
}

//DELETE USER
function deleteUser(req,res){
  User.remove({ email: req.params.email}, function(err){
    if(err) res.send(err);
    res.json({message: 'successfully deleted', redirect: '/'});
  });
}


module.exports = {
  getAll: getAll,
  createUser: createUser,
  showUser: showUser,
  updateUser: updateUser,
  deleteUser: deleteUser
};
