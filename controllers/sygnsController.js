var Sygn = require('../models/sygn.js');

//CREATE SYGN
function createSygn(req,res){
    var sygn = new Sygn();
    /*
    //SET SYGN INFO FROM REQUEST
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;
    */
    //SAVE SYGN AND CHECK FOR ERRORS
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
}

// SHOW All SYGNs
function getAll(req, res) {
    Sygn.find({}, function(err, sygns){
        if(err) res.send(err);
        res.json(sygns);
    });
};

//GET AND SHOW INDIVIDUAL SYGN
function showSygn(req, res) {
    console.log("individual user requested");
    //Sygn.findOne({email: req.decoded.email}, function(err, sygn){
        if(err) res.send(err);
        console.log(sygn);
        res.json(sygn);
    });
};

//UPDATE INDIVIDUAL SYGN
function updateSygn(req,res){
    console.log("edit individual sygn requested");
    //Sygn.findOne({email: req.decoded.email}, function(err, sygn){

        console.log('found him');
        if(err) res.send(err);
        /*
        //UPDATE USER PARAMETERS ONLY IF PROVIDED
        if(req.body.firstName) user.firstName = req.body.firstName;
        if(req.body.lastName) user.lastName = req.body.lastName;
        if(req.body.email) user.email = req.body.email;
        if(req.body.password) user.password = req.body.password;
        */
        sygn.save(function(err){
            if(err) res.send(err);
            res.json({message: 'successfully updated', redirect:"/edit"});
        });
    });
}

//DELETE SYGN
function deleteSygn(req, res) {
    //Sygn.remove({ email: req.params.email}, function(err){
        if(err) res.send(err);
        res.json({message: 'successfully deleted', redirect: '/'});
    });
}

module.exports = {
    getAll: getAll,
    createSygn: createSygn,
    showSygn: showSygn,
    updateSygn: updateSygn,
    deleteSygn: deleteSygn
};
