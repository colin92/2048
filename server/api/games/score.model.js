'use strict';

const mongoose = require('mongoose');

let schema = new mongoose.Schema({
	score: Number
});

let Score = mongoose.model('Score', schema);

module.exports = Score;
