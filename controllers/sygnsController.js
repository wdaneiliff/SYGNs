//****** CALL NPM PACKAGES AND MODELS FOR FUNCTIONS *******
var Sygn = require('../models/sygn.js');

//*********** CREATE SYGN ************
function createSygn(req,res){
    var sygn = new Sygn();

    //SET SYGN INFO FROM REQUEST:
    sygn.points = req.body.points;
    sygn.type = req.body.type;
    sygn.monday = req.body.monday;
    sygn.tuesday = req.body.tuesday;
    sygn.wednesday = req.body.wednesday;
    sygn.thursday = req.body.thursday;
    sygn.friday = req.body.friday;
    sygn.saturday = req.body.saturday;
    sygn.sunday = req.body.sunday;

    //SAVE SYGN AND CHECK FOR ERRORS:
    sygn.save(function(err){
        if(err){
            if(err.code == 11000){
                return res.json({success: false, message: 'sygn already exist'});
            } else {
                res.send(err);
            }
        }
        res.json({message:"successful", redirect:"/"});
    });
} //CLOSE CREATE SYGN FUNCTION

//******* SHOW All SYGNs ***********
function getAll(req, res) {
    Sygn.find({}, function(err, sygns){
        if(err) res.send(err);
        res.json(sygns);
    });
} //CLOSE GET ALL SYGNS FUNCTION

//********* GET AND SHOW INDIVIDUAL SYGN *******
function showSygn(req, res) {
    console.log("individual sygn requested");
    Sygn.findOne({_id: req.params.id}, function(err, sygn){
        if(err) res.send(err);
        console.log(sygn);
        res.json(sygn);
    });
} //CLOSE SHOW INDIVIDUAL SYGN FUNCTION

//********  UPDATE INDIVIDUAL SYGN  ***********
function updateSygn(req,res){
    console.log("edit individual sygn requested");
    Sygn.findOne({_id: req.params.id}, function(err, sygn){

        console.log('found sygn');
        if(err) res.send(err);

        //UPDATE USER PARAMETERS ONLY IF PROVIDED:
        if(req.body.point1) sygn.point1 = req.body.point1;
        if(req.body.point2) sygn.point2 = req.body.point2;
        if(req.body.type) sygn.type = req.body.type;
        if(req.body.monday) sygn.monday = req.body.monday;
        if(req.body.tuesday) sygn.tuesday = req.body.tuesday;
        if(req.body.wednesday) sygn.wednesday = req.body.wednesday;
        if(req.body.thursday) sygn.thursday = req.body.thursday;
        if(req.body.friday) sygn.friday = req.body.friday;
        if(req.body.saturday) sygn.saturday = req.body.saturday;
        if(req.body.sunday) sygn.sunday = req.body.sunday;

        sygn.save(function(err){
            if(err) res.send(err);
            res.json({message: 'successfully updated', redirect:"/edit"});
        });
    });
} //CLOSE UPDATE INDIVIDUAL USER SYGN

//******** DELETE SYGN ***********
function deleteSygn(req, res) {
  var id = req.params.id;
    //Sygn.remove({id: req.params.id}, function(err,sygn){
    Sygn.remove({_id: id}, function(err,sygn){

        if(err) res.send(err);
        res.json({message: 'successfully deleted', redirect: '/'});
    }
  );
} //CLOSE DELETE SYGN FUNCTION

//******* EXPORT FUNCTIONS FOR USE ON SERVER ********
module.exports = {
    getAll: getAll,
    createSygn: createSygn,
    showSygn: showSygn,
    updateSygn: updateSygn,
    deleteSygn: deleteSygn
};
