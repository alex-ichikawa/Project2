var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    // db.Example.findAll({}).then(function(dbExamples) {
      res.render("index", {
        msg: "Welcome!",
        // examples: dbExamples
      });
    });

  app.get("/signin", function(req, res){
      res.render("signin");
  });

  app.get("/signup", function(req, res){
      res.render("signup");
  });
  // });

  app.get("/home/:id/:firstName", function(req, res) {
      // console.log(req, "this should be the user");
    
    res.render("home",{id: req.params.id, firstName:req.params.firstName});
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
