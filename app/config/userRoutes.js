var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
userRouter = express();

var usersController = require('../controllers/usersController.js');

userRouter.route('/')

  //GET
    .get(usersController.getAll)

  //POST
    .post(usersController.createUser);

userRouter.route('/:id')

  //GET
      .get(usersController.showUser)

  //POST
      .patch(usersController.updateUser)

  //POST
      .delete(usersController.deleteUser);

//EXPORTS
module.exports = userRouter;
