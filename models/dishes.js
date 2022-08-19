const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;


const disheSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: String,
		required: true
	},
}, {
	timestamps: true
});


const commentSchema = new mongoose.Schema({
	rating: {
		type: Number,
		min: 1,
		max: 5,
		required: true
	},
	comment: {
		type: Array,
		required: true
	},
	author: {
		type: String,
		required: true
	}
}, {
    timestamps: true
})


const dishSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	label: {
		type: String,
		required: true
	},
	price: {
		type: Currency,
		required: true
	},
	featured: {
		type: Boolean,
		default: false
	},
	comments: [commentSchema]
}, {
    timestamps: true
})


const Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;