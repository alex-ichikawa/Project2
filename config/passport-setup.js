var bcrypt = require("bcrypt-nodejs");
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var models = require('../models');


passport.serializeUser((user, done)=>{
    done(null,{id: user.id})
})

passport.deserializeUser((user, done)=> {
    models.findOne({where:{id: user.id}}).then(user => done(user));
})

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, username, password, done){
    models.User.findOne({
        where: {
          email: username
  
        }
      }).then(function (user, err) {
        if(err){ console.log(err)}

        if (user) {
          if (bcrypt.compareSync(password , user.password)) {
  
            // res.json(match.firstName);
            console.log(`name is ${user.firstName}`);
            return done(null, user)
          }
          else {
            return done(null, false); 
  
          }
        }
  
      });
} ))

passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
function(req, username, password, done){
    models.User.findOne({
        where: {
          email: username
        }
      }).then(function (user) {
            if(user){
                return done(null, false);
            }else {

                var passwordToSave = bcrypt.hashSync(req.body.password);
                console.log(passwordToSave);
                models.User.create({
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  email: req.body.email,
                  password: passwordToSave
            
                })
                  .then(function (result) {
                    
                        return done(null, result);
            
                  });

            }

  
      });   
    }

))