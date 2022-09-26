var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const User = require("../models/user");
const passport = require("passport");

router.use(bodyParser.json());
/* GET users listing. */

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/*
router.route('/').get((req, res, next) => {
  res.send('respond with a resource');
})
*/

// Signup
router.post("/signup", (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: "Registration Successful!" });
        });
      }
    }
  );
});

// Login
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ success: true, status: "You are successfully loggedin!" });
});

// Logout

router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    const err = new Error("You are not logged in!");
    res.status = 403;
    next(err);
  }
});

module.exports = router;

router;
