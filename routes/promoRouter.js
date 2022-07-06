// Task 2

const express = require('express');
const bodyParser = require('body-parser');


const promoRouter = express.Router();

promoRouter.use(bodyParser.json());


// /promotion
promoRouter.route('/')
.all((req, res, next) => {
	res.statusCode = 200;
	res.setHeader("ContentType", "text/plain");
	next();
})

.get((req, res, next) => {
	res.end("Will send all the promotions to you!");
})

.post((req, res, next) => {
	res.end(`Will add the promotion: ${req.body.name} with detials: ${req.body.description}`);
})

.put((req, res, next) => {
	res.statusCode = 403;
	res.end("PUT operation not supported on /promotion");
})

.delete((req, res, next) => {
	res.end("Deleting all promotion");
})


// /promotion/:promoId
promoRouter.route('/:promoId')
.get((req,res, next) => {
	res.end(`will send details of the promotion: ${req.params.promoId} to you!`);
})

.post((req, res, next) => {
	res.statusCode = 403;
	res.end(`POST operation not supported on /promotion${req.params.promoId}`);
})

.put((req, res, next) => {
	console.log(req.body);
	res.write(`Updating the promotion: ${req.params.promoId} \n`);
	res.end(`with update the promotion: ${req.body.name} with details: ${req.body.description}`);
})

.delete((req, res, next) => {
	res.end(`Deleting promotion: ${req.params.promoId}`);
})


module.exports = promoRouter;


