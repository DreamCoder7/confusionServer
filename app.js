var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
const passport = require("passport");
const authenticate = require("./authenticate");
const config = require("./config");

var index = require("./routes/index");
var users = require("./routes/users");
var dishRouter = require("./routes/dishRouter");
var promoRouter = require("./routes/promoRouter");
var leaderRouter = require("./routes/leaderRouter");
var uploadRouter = require("./routes/uploadRouter");
var favoriteRouter = require("./routes/favoriteRouter");
var commentRouter = require("./routes/commentRouter");

var app = express();
// const {connect} = require("mongoose");
const mongoose = require("mongoose");
const Dishes = require("./models/dishes");
const Promotions = require("./models/promotions");
const Leaders = require("./models/leaders");
const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then(
  (db) => {
    console.log("Connected correctly to server");
  },
  (err) => {
    console.log(err);
  }
);

app.all("*", (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect(
      307,
      "https://" + req.hostname + ":" + app.get("secPort") + req.url
    );
  }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// Setup Cookies
// app.use(cookieParser("12345-67890-09876-54321"));

// Session
// app.use(
//   session({
//     name: "session-id",
//     secret: "12345-67890-09876-54321",
//     saveUninitialized: false,
//     resave: false,
//     store: new FileStore(),
//   })
// );

app.use(passport.initialize());
app.use(passport.session());

// Basic Authentication
// function auth(req, res, next) {
//   if (req.user) {
//     let err = new Error("You are not authenticated!");
//     err.status = 403;
//     next(err);
//   } else {
//     next();
//   }
// }

// app.use(auth);

app.use("/", index);
app.use("/users", users);

app.use(express.static(path.join(__dirname, "public")));

app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);
app.use("/imageUpload", uploadRouter);
app.use("/favorite", favoriteRouter);
app.use("/comments", commentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  // res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
