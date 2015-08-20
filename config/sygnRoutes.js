var express         = require('express');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
sygnRouter          = express();

var sygnsController = require('../controllers/sygnsController.js');


sygnRouter.route('/')
    //GET
    .get(sygnsController.getAll)
    //POST
    .post(sygnsController.createUser);


sygnRouter.route('/:email')
  //GET ONE USER
  .get(sygnsController.showUser)
  //PATCH USER
  .patch(sygnsController.updateUser)
  //DELETE USER
  .delete(sygnsController.deleteUser);

//EXPORTS
module.exports = sygnRouter;
