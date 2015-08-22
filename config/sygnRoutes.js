//CALL NPM PACKAGES
var express         = require('express');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var sygnRouter      = express();

var sygnsController = require('../controllers/sygnsController.js');


sygnRouter.route('/')
  //GET
    .get(sygnsController.getAll)
  //POST
    .post(sygnsController.createSygn);


sygnRouter.route('/:id')
  //GET ONE USER
    .get(sygnsController.showSygn)
  //PATCH USER
    .patch(sygnsController.updateSygn)
  //DELETE USER
    .delete(sygnsController.deleteSygn);

//EXPORTS
module.exports = sygnRouter;
