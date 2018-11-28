require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var bcrypt = require("bcrypt-nodejs");
var passportSetup = require("./config/passport-setup");
var cookieSession = require("cookie-session");
var passport = require('passport');
var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: "secret"
}))

app.use(passport.initialize());
app.use(passport.session());
// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}
else if (process.env.NODE_ENV === 'production'){
	app.use(express.static('client/build'));
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
