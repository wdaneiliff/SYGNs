//CALL PACKAGES
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 8080;
var User = require('./app/models/user.js');
var jwt = require('jsonwebtoken');

var mongoose = require('mongoose');

//TOKEN CONFIG
var superSecret = 'iamtherealbatman';

//CONNECT OUR DATABASE
mongoose.connect('mongodb://localhost/project3');

//USE PUBLIC FOLDER FOR ANY FILE REQUESTS
app.use(express.static(__dirname + '/public'));

//APP congfiguration
app.use(bodyParser.urlencoded( {extended : true} ));
app.use(bodyParser.json());

app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','Get,Post');
  res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type, Authorization');
  next();
});

//LOGGER FOR SERVER REQUESTS
app.use(morgan('dev'));

//HOMEPAGE ROUTER
app.get('/', function(req,res){
    res.send("welcome to the homepage");
});

app.get('/login', function(req,res){
    res.sendfile('./views/index.html');
});

//API ROUTE
var apiRouter = express.Router();

//ROUTE TO AUTHENTICATE A USER
apiRouter.post('/authenticate',function(req,res){
  User.findOne({email: req.body.email}).select('email firstName password').exec(function(err,user){
    if(err) throw err;

    //HANDLE IF NO USER FOUND
    if(!user){
      res.json({success: false, message: 'Invalid email'});
    } else {
      //VALIDATE PASSWORD TO MATCH USER
      var validPW = user.comparePassword(req.body.password);
      if (!validPW){
        res.json({success: false, message: 'Invalid password'});
      } else {
        //CREATE AND SEND TOKEN NOW THAT USER FOUND AND PW CLEARS
        console.log('user found and password verified, creating token..');
        var token = jwt.sign({
          email: user.email,
          firstName: user.firstName },
          superSecret,
          { expiresInMinutes: 1440 }
        );
        //RETURN RESPONSE WITH TOKEN
        res.json({success: true, message: 'enjoy your token', token: token});
      }
    }

  });
});

//API ROUTE MIDDLEWARE
apiRouter.use(function(req,res,next){
  //LOG A NEW REQ
  console.log("Someone just came to the API route");

  //CHECK FOR ACTIVE TOKEN IN URL OR POST PARAMS
  var token =  req.body.token || req.param('token') || req.headers['x-access-token'];

  //DECODE TOKEN
  if(token){

    //VERIFY SECRET AND CHECK TOKEN EXPIR
    jwt.verify(token, superSecret, function(err, decoded){
      if(err){
        res.status(403).send({success: false, message: 'failed to authen token'});
      } else {
        //IF TOKEN IS VALID AND ACTIVE, SAVE FOR OTHER ROUTES TO users
        req.decoded = decoded;
        next(); //MOVE ON NEXT ACTION
      }
    });
  } else {
    //IF THERE IS NO TOKEN, RETURN ACCESS FORBIDDEN RESPONSE
    return res.status(403).send({success: false, message: 'no token provided'});
  }

});

apiRouter.get('/me', function(req,res){
  res.send(req.decoded);
});

apiRouter.get('/', function(req,res){
    res.json( {message: "welcome to the api page"} );
});

apiRouter.route('/users')

  //CREATE USER
  .post(function(req,res){
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

  })

  .get(function(req,res){
    User.find({}, function(err, users){
      if(err) res.send(err);
      res.json(users);
    });
  });

apiRouter.route('/users/:user_id')

  //GET AND SHOW INDIVIDUAL USER
  .get(function(req,res){
    console.log("individual user requested");
    User.find(req.params.user_id, function(err, user){
      if(err) res.send(err);
      res.json(user);
    });
  })

  //GET AND SHOW INDIVIDUAL USER
  .put(function(req,res){
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
  })

  .delete(function(req,res){
    User.remove({ _id: req.params.user_id}, function(err){
      if(err) res.send(err);
      res.json({message: 'successfully deleted'});
    });
  });


//REGISTER THE API ROUTE
app.use('/api', apiRouter);


//APP TO LISTEN ON PORT 8080
app.listen(port);
console.log('magic happnes on port' + port);
