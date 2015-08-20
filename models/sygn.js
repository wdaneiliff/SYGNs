//BRING IN ALL REQUIRE PACKAGES
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;


var SygnSchema = new Schema({

    point1 : Number,
    point2 : Number,
    type: String,
    monday:[],
    tuesday:[],
    wednesday:[[6,8],[4,6]],
    thursday:[],
    friday:[],
    saturday:[],
    sunday:[],
    user_email: String
});



//EXPORT THE MODEL
module.exports = mongoose.model("Sygn", SygnSchema);
