var mongoose = require('mongoose');
var Game = require('./game.model');
var Score = require('./score.model');

module.exports = {
	index: _index,
	findOrCreate: _findOrCreate,
	find: _find,
	addScore: _addScore,
  scores: _scores
}

function _index(req, res, next) {
  Game	
		.find()
		.exec()
		.then(function(game) {
			res.send(game);
		});
}

function _findOrCreate(req, res, next) {
	Game
		.create(req.body, function(err, game){
			if(err) {
				res.status(400).send(err);
			}

			res.status(201).send(game);
		});
}

function _find(req, res, next) {
	Game
		.findOne({ name: req.params.name }, function(err, game){
			if(err) {
				res.status(400).send(err);
			}

			res.status(201).send(game);
		});
}

function _scores(req, res, next) {
  Score
    .find()
    .exec()
    .then(function(scores) {
      res.send(scores); 
    });
}

function _addScore(req, res, next) {
  Score 
		.create(req.body, function(err, score) {
			res.send(score);
		});
}
