require("dotenv").config();
let request = require("request");
var db = require("../models");
var bcrypt = require("bcrypt-nodejs");



module.exports = function (app) {
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
  app.post("/api/createuser", function (req, res) {
    console.log(`user enteres for password ${req.body.password} and ${req.body.email}`);
    var passwordToSave = bcrypt.hashSync(req.body.password);
    console.log(passwordToSave);
    db.User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: passwordToSave

    })
      .then(function (result) {
        res.json(result);

      });
  });

  // check user credentials and authenticate
  app.post("/api/authenticate", function (req, res) {

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

        }
      }

    });



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
