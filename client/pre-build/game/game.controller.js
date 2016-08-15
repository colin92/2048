app.controller('GameController', function($window, $scope, Game, hotkeys, scores) {
  var game = new Game();

  $scope.game = game;
  $scope.scores = scores;
  $scope.saveGame = function saveGame() {
    var game_name = $window.prompt('Please enter a name for your save game'); 
    game.save(game_name);
  };

  $scope.loadGame = function saveGame() {
    var game_name = $window.prompt('Please enter the name of a saved game'); 
    game.load(game_name).then(function(response) {
      console.log(response);
      game.setBoard(response.data.board);
    });
  };

  hotkeys.add({
    combo: 'up',
    description: 'move all tiles up',
    callback: function() {
      console.log('up');
      game.move('up'); 
    }
  });

  hotkeys.add({
    combo: 'down',
    description: 'move all tiles down',
    callback: function() {
      console.log('down');
      game.move('down'); 
    }
  });

  hotkeys.add({
    combo: 'left',
    description: 'move all tiles left',
    callback: function() {
      console.log('left');
      game.move('left'); 
    }
  });

  hotkeys.add({
    combo: 'right',
    description: 'move all tiles right',
    callback: function() {
      console.log('right');
      game.move('right'); 
    }
  });

  hotkeys.add({
    combo: 'r',
    description: 'restart game',
    callback: function() {
      console.log('reset');
      game.reset(); 
    }
  });
});
