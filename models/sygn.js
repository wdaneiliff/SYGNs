//BRING IN ALL REQUIRE PACKAGES
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var bcrypt      = require('bcrypt-nodejs');

var SygnSchema = new Schema({
    /*
    firstName : String,
    lastName : String,
    email : { type: String, required: true, index: {unique:true} },
    password : { type: String, required: true, select: false }
    */
});

SygnSchema.pre('save', function(next){
  var sygn = this;

});

//METHOD TO COMPARE PW WITH CURRENT DB password
SygnSchema.methods.comparePassword = function(password){
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

//EXPORT THE MODEL
module.exports = mongoose.model("Sygn", SygnSchema);
