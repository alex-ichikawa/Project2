require("dotenv").config();
let request = require("request");
var db = require("../models");

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    res.render("index", {
      msg: "Welcome!",
    });
  });

  app.get("/signin", function (req, res) {
    res.render("signin");
  });

  app.get("/signup", function (req, res) {
    res.render("signup");
  });


  app.get("/home/:id/:firstName", function (req, res) {
    let id = req.params.id;
    db.User.findOne({ where: { id: id } }).then(function (user) {
      res.render("home", {
        user: user
      });
    });
  });

  app.get("/location/:id/:name/:address", function (req, res) {
    regexStep1 = req.params.name.replace(/'/g, '%27');
    regexStep2 = regexStep1.replace(/#/g, '%23');
    regexStep3 = regexStep2.replace(/&/g, '%26');
    regexStep4 = regexStep3.replace(/ /g, '%20');
    let name = regexStep4;
    let address = req.params.address;
    let id = req.params.id;
    request(`https://data.cityofchicago.org/resource/cwig-ma7x.json?dba_name=${name}&address=${address}%20&$order=inspection_date DESC&$$app_token=${process.env.chicagoAPI}`, function (err, response, body) {
      if (!err && response.statusCode === 200) {
        locationInfo = JSON.parse(body);
        console.log(locationInfo);
        db.User.findOne({ where: { id: id } }).then(function (user) {
          res.render("location", {
            locations: locationInfo,
            user: user
          });
        });
      }
      else {
        console.log(err);
      }
    }); 

  });

  app.get("/favorites/:id/:firstName", function (req, res) {
    let  id = req.params.id;
    console.log("fav userid " + id);
    db.Favorite.findAll({ where: { userNum: req.params.id } }).then(function (favs) {
      console.log("step 1");
      db.User.findOne({ where: { id: id } }).then(function (user) {
        console.log("step 2");
        res.render("favorites", {
          favorites: favs,
          user: user
        });
      });
    });
  });


  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });


};
