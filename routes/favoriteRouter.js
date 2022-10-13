const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticate = require("../authenticate");
const cors = require("./cors");

const Favorite = require("../models/favorite");

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    // populate the user information and the dishe information
    Favorite.findOne({ user: req.user._id })
      .populate("user")
      .populate("dishes")
      .exec((err, favorite) => {
        if (!err) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorite);
        }
      });
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }, (err, favorite) => {
      if (err) return next(err);

      if (!favorite) {
        Favorite.create({ user: req.user._id })
          .then((favorite) => {
            for (i = 0; i < req.body.length; i++)
              if (favorite.dishes.indexOf(req.body[i]._id))
                favorite.dishes.push(req.body[i]);
            favorite
              .save()
              .then((favorite) => {
                Favorite.findById(favorite._id)
                  .populate("user")
                  .populate("dishes")
                  .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                  });
              })
              .catch((err) => {
                return next(err);
              });
          })
          .catch((err) => {
            return next(err);
          });
      } else {
        for (i = 0; i < req.body.length; i++)
          if (favorite.dishes.indexOf(req.body[i]._id))
            favorite.dishes.push(req.body[i]);
        favorite
          .save()
          .then((favorite) => {
            Favorite.findById(favorite._id)
              .populate("user")
              .populate("dishes")
              .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              });
          })
          .catch((err) => {
            return next(err);
          });
      }
    });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "application/json");
    res.end("PUT operation not supported on /favorites");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndRemove({ user: req.user._id }, (err, resp) => {
      if (err) return next(err);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(resp);
    });
  });

favoriteRouter
  .route("/:dishId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then(
      (favorite) => {
        if (!favorite) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          return res.json({ exists: false, favorite: favorite });
        } else {
          if (favorite.dishes.indexOf(req.params.dishId) < 0) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({ exists: false, favorite: favorite });
          } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({ exists: true, favorite: favorite });
          }
        }
      },
      (err) => next(err)
    );
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }, (err, favorite) => {
      console.log(favorite.dishes);
      if (err) return next(err);

      if (!favorite) {
        Favorite.create({ user: req.user._id })
          .then((favorite) => {
            favorite.dishes.push({ _id: req.params.dishId });
            favorite
              .save()
              .then((favorite) => {
                Favorite.findById(favorite._id)
                  .populate("user")
                  .populate("dishes")
                  .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                  });
              })
              .catch((err) => {
                return next(err);
              });
          })
          .catch((err) => {
            return next(err);
          });
      } else {
        if (favorite.dishes.indexOf(req.params.dishId) < 0) {
          favorite.dishes.push({ _id: req.params.dishId });
          favorite
            .save()
            .then((favorite) => {
              Favorite.findById(favorite._id)
                .populate("user")
                .populate("dishes")
                .then((favorite) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(favorite);
                });
            })
            .catch((err) => {
              return next(Err);
            });
        } else {
          res.statusCode = 403;
          res.setHeader("Content-Type", "text/plain");
          res.json("Dish " + req.params.dishId + " already exist!");
        }
      }
    });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "application/json");
    res.end("PUT operation not supported on /favorite/" + req.params.dishId);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }, (err, favorite) => {
      if (err) return next(err);

      const index = favorite.dishes.indexOf(req.params.dishId);

      if (index >= 0) {
        favorite.dishes.splice(index, 1);
        favorite
          .save()
          .then((favorite) => {
            Favorite.findById(favorite._id)
              .populate("user")
              .populate("dishes")
              .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              });
          })
          .catch((err) => {
            return next(err);
          });
      } else {
        res.statusCode = 403;
        res.setHeader("Content-Type", "text/plain");
        res.end("Dish " + req.params.dishId + " isn't in your favourite!");
      }
    });
  });

module.exports = favoriteRouter;
