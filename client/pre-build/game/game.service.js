app.service('Game', function($http) {
  
  /* GAME CLASS */

  var Game = function Game(saved_board) {
    // value to use for empty cell
    this.EMPTY_VALUE = 0;	
    // size of board;
    this.SIZE = 4;

    // create new board or use saved one
    var board = saved_board || this.constructBoard(this.SIZE, this.EMPTY_VALUE);

    // getter function for board
    this.getBoard = function getBoard() {
      return board; 
    };
    
    // setter function for board;
    this.setBoard = function setBoard(new_board) {
      board = new_board; 
    };

    // get a single column by index (start from 0)
    this.getBoardColumn = function getBoardColumn(column_number) {
      var column = [];
      board.forEach(function(row) {
        column.push(row[column_number]);
      }); 
      return column;
    };

  // set a column by index (start from 0), pass in the column
  this.setBoardColumn = function getBoardColumn(column_number, column) {
      board.forEach(function(row, index) {
        row[column_number] = column[index];
      }); 
    };

    // these row function wrappers help simplify the move function
    this.getBoardRow = function getBoardRow(row_number) {
      return board[row_number]; 
    };

    this.setBoardRow = function setBoardRow(row_number, row) {
      board[row_number] = row; 
    };

    // place a new square on initialization of game
    this.placeNewSquare();

  };

  /* MAIN GAME FUNCTIONS */

  // solve movement of tiles on board based on direction
  Game.prototype.move = function move(direction) {
    var board = this.getBoard();

    // variable tracks if the board has changed to decide to place new tile 
    var has_changed = false;

    // select the proper function to get sections of the board;
    var getBoardSection, setBoardSection;
    if(direction === 'up' || direction === 'down') {
      getBoardSection = this.getBoardColumn;
      setBoardSection = this.setBoardColumn;
    } else {
      getBoardSection = this.getBoardRow;
      setBoardSection = this.setBoardRow;
    }

    // is the direction 'down' or 'right'? important for solving a section of the 
    // board correctly
    var isDownOrRight = direction === 'down' || direction === 'right';

    // Iterate over each section based on size
    for(var n=0; n < this.SIZE; n++) {
      var section = getBoardSection(n);

      // remove empty values from array;
      var clean_section = this.removeEmpty(section);

      // pass in cleaned section and direction to merge values/pad empty cells
      var solved_section = this.solveBoardColumnRow(isDownOrRight, clean_section);
      
      has_changed = has_changed || this.detectChanges(section, solved_section);

      // set the new array in place of the old
      setBoardSection(n, solved_section);

    }

    // check if gameover or won
    this.checkWon();

    // if the board has changed, add a new tile
    if(has_changed) this.placeNewSquare();

  };

  // Make a call to the API to save the score
  Game.prototype.saveScore = function saveScore(score) {
    return $http.post('/api/games/score', {
      score: score 
    }); 
  };

  // create a clean board
  Game.prototype.reset = function reset() {
    var new_board = this.constructBoard(this.SIZE, this.EMPTY_VALUE); 
    this.setBoard(new_board);
    this.over = false;
    this.won = false;
    this.placeNewSquare();
  };

  // save board to database
  Game.prototype.save = function save(save_name) {
    var self = this;
    return $http.put('/api/games', {
      board: self.getBoard(),
      name: save_name
    });
  };

  // load board from database based on name
  Game.prototype.load = function load(load_name) {
    var self = this;
    return $http.get('/api/games/' + load_name);
  };

  /* HELPER FUNCTIONS */

  // solve movement of a section of the board. reverse array if moving right or down 
  Game.prototype.solveBoardColumnRow = function solveBoardColumnRow(isDownOrRight, section) {
    var newArr = [];
    // if moving right or down, reverse array
    if(isDownOrRight) section.reverse();

    for(var n=0; n < section.length; n++) {
      // check if the the cell matches the next cell, if so, merge values and skip
      // to following cell
      if(section[n+1] && section[n] === section[n+1]) {
        newArr.push(section[n] + section[n]);
        n++;
      } else {
        newArr.push(section[n]);
      }
    }

    // pad array with empty value to restore to proper length for board
    var padding = this.SIZE - newArr.length;
    for(var i=0; i < padding; i++) {
      newArr.push(this.EMPTY_VALUE);
    }
    // reverse back new array if moving right or down
    if(isDownOrRight) newArr.reverse();
    return newArr;
  };

  // remove empty cells from array
  Game.prototype.removeEmpty = function removeEmpty(arr) {
    return arr.filter(function(val) {
      return val !== this.EMPTY_VALUE;
    }, this);
  };

  // This function checks if the game is over
  // and determines if the game is won
  Game.prototype.checkWon = function checkWon() {
    var board = this.getBoard();
    var hasValidMove = false;
    var highest_tile = 2;
    for(var row = 0, len = board.length; row < len; row++) {
      for(var column = 0, leng = board[row].length; column < leng; column++) {
        var cell = board[row][column];
        highest_tile = highest_tile < cell ? cell : highest_tile;
        // checks if cell has 2048 to see if game is won, 
        // if so, returns and saves score
        if(cell === 2048) {
          this.over = true;
          this.won = true;
          return this.saveScore(2048); 
          // else if checks if there are valid moves left by
          // checking if any tiles next to each other match
        } else if ( 
          (column > 0 && cell === board[row][column - 1]) ||
          (column < len && cell === board[row][column + 1]) ||
          (row > 0 && cell === board[row - 1][column]) ||
          (row < leng - 1 && cell === board[row + 1][column])
        ) { 
          hasValidMove = true; 
        }
      }
    }
    // if the board is empty and there are no valid moves, game is lost
    if (!this.getEmptyCellCount() && !hasValidMove) {
      this.over = true;
      this.won = false;
      // save highest tile value as a high score
      return this.saveScore(highest_tile);
    }
  };

  // Checks to see if there are empty cells returns count of them
  Game.prototype.getEmptyCellCount = function getEmptyCellCount() {
    // preserve the definition of 'this' in forEach loop
    var self = this;

    var board = this.getBoard();
    var count = 0; 
    board.forEach(function(row) {
      row.forEach(function(cell) {
        if(cell === self.EMPTY_VALUE) {
          count++;
        }
      }); 
    });
    return count;
  };

  // calculates empty cells and randomly picks one to place new tile
  Game.prototype.placeNewSquare = function placeNewSquare() {
    var board = this.getBoard();
    // gets a count of empty cells
    var count = this.getEmptyCellCount(); 

    // determines which empty cell to place new tile in
    var random_cell = Math.floor(Math.random() * count);
    var current_count = 0;
    for(var row = 0, len = board.length; row < len; row++) {
      for(var column = 0, leng = board[row].length; column < leng; column++) {
        // iterate over board and count up empty cells till it gets to
        // the randomly picked one.
        if(board[row][column] === 0) { 
          if(current_count == random_cell) {
            // places a tile with 2 or 10% chance of placing a 4
            board[row][column] = Math.random() < 0.9 ? 2 : 4; 
            return;
          }
          else {
            current_count++; 
          }
        }
      }
    }
  };

  // detect changes in board
  Game.prototype.detectChanges = function detectChanges(old_section, new_section) {
    return new_section.join('') !== old_section.join('');
  };

  // construct a new board based on size and empty_value variables
  Game.prototype.constructBoard = function constructBoard() {
    var size = this.SIZE;
    var new_board = [];
    for(var y=0; y < size; y++) {
      var row = [];
      for(var x=0; x < size; x++) {
        row.push(this.EMPTY_VALUE);
      }
      new_board.push(row);
    }
    return new_board;
  };


	return Game;

});
