var router = require('express').Router();

var controller = require('./game.controller.js');

module.exports = router;

// save and retrieve scores
router.post('/score', controller.addScore);
router.get('/score', controller.scores);

// retrieve games
router.get('/:name', controller.find);

// retrieve all games 
router.get('/', controller.index);

// save game 
router.put('/', controller.findOrCreate);
