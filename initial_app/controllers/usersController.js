var User = require('../app/models/user.js');

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
    res.json({message: "User Created"});
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
  User.find(req.params.user_id, function(err, user){
    if(err) res.send(err);
    res.json(user);
  });
}

//UPDATE INDIVIDUAL USER
function updateUser(req,res){
  console.log("edit individual user requested");
  User.findById(req.params.user_id, function(err, user){
    if(err) res.send(err);

    //UPDATE USER PARAMETERS ONLY IF PROVIDED
    if(req.body.firstName) user.firstName = req.body.firstName;
    if(req.body.lastName) user.lastName = req.body.lastName;
    if(req.body.email) user.email = req.body.email;
    if(req.body.password) user.password = req.body.password;

    user.save(function(err){
      if(err) res.send(err);
      res.json({message: 'successfully updated'});
    });
  });
}

//DELETE USER
function deleteUser(req,res){
  User.remove({ _id: req.params.user_id}, function(err){
    if(err) res.send(err);
    res.json({message: 'successfully deleted'});
  });
}


module.exports = {
  getAll: getAll,
  createUser: createUser,
  showUser: showUser,
  updateUser: updateUser,
  deleteUser: deleteUser
};
