//******* BRING IN ALL REQUIRED PACKAGES ********
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

//****** CREATE SYGN SCHEMA ***********
var SygnSchema = new Schema({
    point1 : [],
    point2 : [],
    type: String,
    monday:[],
    tuesday:[],
    wednesday:[],
    thursday:[],
    friday:[],
    saturday:[],
    sunday:[],
    user_email: String
});

//******** EXPORT THE SYGN MODEL *********
module.exports = mongoose.model("Sygn", SygnSchema);
