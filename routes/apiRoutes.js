require("dotenv").config();
let request = require("request");
var db = require("../models");
var bcrypt = require("bcrypt-nodejs");
var passport = require('passport');



module.exports = function (app) {
  // Get all examples
  app.get("/api/examples", function (req, res) {
    db.Example.findAll({}).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function (req, res) {
    db.Example.create(req.body).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function (req, res) {
    
    db.Example.destroy({ where: { id: req.params.id } }).then(function (dbExample) {
      res.json(dbExample);
    });
  });
// req.user 


/*module.exports = function (app) {*/

  // Added by Navreet --------------------------------------------------------------------------------------------------------
  // check if email already exists
  app.post("/api/checkemail", function (req, res) {
    let emailToCheck = req.body.email;
    console.log(`eamil entered ${emailToCheck}`);
    db.User.findOne({
      where: {
        email: emailToCheck
      }
    }).then(function (emailMatch) {
      res.json(emailMatch);

    });
  });
  // create new user
  app.post("/api/createuser", function (req, res, next) {
      passport.authenticate('signup', (err, user, info)=>{
        if(err){ return next(err)}
        if(!user){ return res.json({user: false})}
        req.logIn(user, function(err){
            if(err) {return next(err)}
            return res.json({user: true})
        })
      })(req, res, next)
  });
  app.get('/api/logout', function(req, res){
    req.logout();
    res.send('logged out');
  });
  // check user credentials and authenticate

  app.post("/api/authenticate", function (req, res, next) {

  
    passport.authenticate('login', (err, user, info)=>{
      // if(err){ return next(err)}
      if(!user){ return res.json({user: false})}
      // req.login(user, function(err){
      //     if(err) {return next(err)}
      else {
          return res.json({user: user})

 /* app.post("/api/authenticate", function (req, res) {

    let passwordToCheck = req.body.password;

    let emailToCheck = req.body.email;

    db.User.findOne({
      where: {
        email: emailToCheck

      }
    }).then(function (match) {

      if (match) {
        if (bcrypt.compareSync(passwordToCheck, match.password)) {

          res.send(match);
        }
        else {
          res.send(null);

        }*/

      }
      }) (req, res, next)
  



  });

// Main Page - API Routes for Chicago health database =============================================================

// Default route for no zip or name input
  app.get("/api/default/:offset", function (req, res) {
    let offset = req.params.offset;
    request(`https://data.cityofchicago.org/resource/cwig-ma7x.json?$limit=15&$offset=${offset}&$order=inspection_date DESC&$$app_token=${process.env.chicagoAPI}`, function (err, response, body) {
      if (!err && response.statusCode === 200) {
        res.json(body);
      }
      else {
        console.log(err);
      }
    });
  });

// Search by zip
app.get("/api/zip/:offset/:zip", function (req, res) {
  let offset = req.params.offset;
  let zip = req.params.zip;
  request(`https://data.cityofchicago.org/resource/cwig-ma7x.json?$limit=15&$offset=${offset}&zip=${zip}&$order=inspection_date DESC&$$app_token=${process.env.chicagoAPI}`, function (err, response, body) {
    if (!err && response.statusCode === 200) {
      res.json(body);
    }
    else {
      console.log(err);
    }
  });
});

// Search by name
app.get("/api/name/:offset/:name", function (req, res) {
  let offset = req.params.offset;
  let name = req.params.name;
  request(`https://data.cityofchicago.org/resource/cwig-ma7x.json?$limit=15&$offset=${offset}&$where=lower(dba_name) like %27%25${name}%25%27&$order=inspection_date DESC&$$app_token=${process.env.chicagoAPI}`, function (err, response, body) {
    if (!err && response.statusCode === 200) {
      console.log(body);
      res.json(body);
    }
    else {
      console.log("err " + err);
    }
  });
});

// Add to favorites

// need to add userid
app.post("/api/:id/favorite", function (req, res) {
  let id = req.params.id;
  db.Favorite.create({
    userNum: id,
    favId: req.body.favId,
    favName: req.body.favName,
    favAddress: req.body.favAddress,
    favRisk: req.body.favRisk,
    favResult: req.body.favResult,
    favViolations: req.body.favViolations,
    favDate: req.body.favDate,
    UserId: id
  }).then(function(result) {
    res.json(result);
  })
});

// Favorites Page ==============================================================================

app.delete("/api/delete/:userId/:inspectionId", function(req, res) {
  let userNum = req.params.userId;
  let inspectionId = req.params.inspectionId;
  db.Favorite.destroy({
    where: {
      userNum: userNum,
      favId: inspectionId
    }
  });
});
}
