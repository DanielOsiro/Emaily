require("./config");
require("./models/User");
require("./services/passport");

const cookieSession = require("cookie-session");
const passport = require("passport");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// Express middlewares
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Connect to database
mongoose.connect(process.env.MONGODB_URI);

// Generate express routes
require("./routes")(app);

if (process.env.NODE_ENV === "production") {
  // Express will serve up production assets. E.g.:main.js file, main.css file
  app.use(express.static("client/build"));

  // Express will serve up the index index.html file if it doesn't recognize the route
  const path = require("path");

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Port express is running on
const PORT = process.env.PORT || 5000;
app.listen(PORT);
