'use strict';

const mongoose = require('mongoose');

let schema = new mongoose.Schema({
	name: String,
  board: [[Number]]
});

let Game = mongoose.model('Game', schema);

module.exports = Game;
