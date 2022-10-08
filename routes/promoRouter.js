// Task 2

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate')


const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());


// /promotion
promoRouter.route('/')
.get((req, res, next) => {
	Promotions.find({})
	.then((promotions) => {
		res.statusCode = 200;
		res.setHeader('Content-type', 'application/json')
		res.json(promotions);
	}, err => next(err))
	.catch((err) => next(err))
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	Promotions.create(req.body)
	.then((promotion) => {
		console.log("Promotion created", promotion);
		res.statusCode = 200;
		res.setHeader('Content-type', 'application/json')
		res.json(promotion);
	}, err => next(err))
	.catch(err => next(err))
})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	res.statusCode = 403;
	res.end("PUT operation not supported on /promotion");
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	Promotions.remove({})
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-type', 'application/json');
		res.json(resp)
	}, err => next(err))
	.catch(err => next(err))
})


// /promotion/:promoId
promoRouter.route('/:promoId')
.get((req,res, next) => {
	Promotions.findById(req.params.promoId)
	.then((promo) => {
		res.statusCode = 200;
		res.setHeader('Content-type', 'application/json')
		res.json(promo)
	}, err => next(promo))
	.catch(err => next(promo))
})

.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	res.statusCode = 403;
	res.end(`POST operation not supported on /promotion${req.params.promoId}`);
})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	Promotions.findByIdAndUpdate(req.params.promoId, {
		$set:req.body
	}, {new: true})
	.then((promo) => {
		res.statusCode = 200;
		res.setHeader('Content-type', 'application/json')
		res.json(promo)
	}, err => next(err))
	.catch(err => next(err))
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	Promotions.findByIdAndRemove(req.params.promoId)
	.then(resp => {
		res.statusCode = 200;
		res.setHeader('Content-type', 'application/json')
		res.json(resp)
	}, err => next(err))
	.catch(err => next(err))
})


module.exports = promoRouter;


