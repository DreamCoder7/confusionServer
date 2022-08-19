const mongoose = require('mongoose');


const leaderSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	image:{
		type: String,
		required: true
	},
	designation: {
		type: String,
		required: true
	},
	abbr: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	featured: {
		type: Boolean,
		required: true
	}
})


const Leaders = mongoose.model('leaders', leaderSchema);

module.exports = Leaders;
