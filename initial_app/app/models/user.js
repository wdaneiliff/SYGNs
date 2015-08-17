//BRING IN ALL REQUIRE PACKAGES
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
  firstName : String,
  lastName : String,
  email : { type: String, required: true, index: {unique:true} },
  password : { type: String, required: true, select: false }
});

UserSchema.pre('save', function(next){
  var user = this;

  //EXIT IF PW HAS NOT BEEN MODIFIED
  if(!user.isModified('password')) return next();

  //GENERATE SALT
  bcrypt.hash(user.password, null, null, function(err, hash){
    if(err) return next(err);
    //CHANGE PW TO HASH
    user.password = hash;
    next();
  });
});

//METHOD TO COMPARE PW WITH CURRENT DB password
UserSchema.methods.comparePassword = function(password){
  var user = this;

  return bcrypt.compareSync(password, user.password);
};

//EXPORT THE MODEL
module.exports = mongoose.model("User", UserSchema);
