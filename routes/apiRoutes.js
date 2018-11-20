var db = require("../models");
var bcrypt = require("bcrypt-nodejs");

// Create a password salt
// var salt = bcrypt.genSaltSync(10);

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });
  
  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Added by Navreet --------------------------------------------------------------------------------------------------------
  // check if email already exists
  app.post("/api/checkemail", function(req, res) {
    let emailToCheck = req.body.email;
    console.log(`eamil enteres ${emailToCheck}`);
  db.User.findOne({
      where: {
          email: emailToCheck
      }
  }).then(function(emailMatch) {
    res.json(emailMatch);
    
  });
});
// create new user
app.post("/api/createuser", function(req, res) {
  console.log(`user enteres for password ${req.body.password} and ${req.body.email}`);
  var passwordToSave = bcrypt.hashSync(req.body.password);
  console.log(passwordToSave);
  db.User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: passwordToSave

  })
  .then(function(result) {
      res.json(result);
      
    });
  });

// check user credentials and authenticate
app.post("/api/authenticate", function(req, res){

  let passwordToCheck = req.body.password;

  let emailToCheck = req.body.email;
  
  db.User.findOne({
    where: {
      email: emailToCheck

    }
  }).then(function(match){
     
    if (match) {
       if (bcrypt.compareSync(passwordToCheck, match.password)){
                 
          // res.json(match.firstName);
          // console.log(`name is ${match.firstName}`);
          res.send( match);
        }
      else {
        res.send(null);
     
      }
    }

    });
    
    
    
  });


}
