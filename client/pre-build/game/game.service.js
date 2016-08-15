app.service('Game', function($http) {
  
  var Game = function Game(saved_board) {
    var board = saved_board || [
      [0, 0, 0, 0], 
      [0, 0, 0, 0], 
      [0, 0, 0, 0], 
      [0, 0, 0, 0]
    ];

    this.getBoard = function getBoard() {
      return board; 
    };
    
    this.setBoard = function setBoard(new_board) {
      board = new_board; 
    };

    this.getBoardColumn = function getBoardColumn(column_number) {
      var column = [];
      board.forEach(function(row) {
        column.push(row[column_number]);
      }); 
      return column;
    };

    this.setBoardColumn = function getBoardColumn(column_number, column) {
      board.forEach(function(row, index) {
        row[column_number] = column[index];
      }); 
    };

    var saveScore = function saveScore(score) {
      return $http.post('/api/games/score', {
        score: score 
      }); 
    };

    this.checkWon = function checkWon() {
      var hasValidMove = false;
      var highest_tile = 2;
      for(var row = 0, len = board.length; row < len; row++) {
        for(var column = 0, leng = board[row].length; column < leng; column++) {
          var cell = board[row][column];
          highest_tile = highest_tile < cell ? cell : highest_tile;
          if(cell === 2048) {
            this.over = true;
            this.won = true;
            return saveScore(2048); 
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
      if (!getEmptyCellCount() && !hasValidMove) {
        this.over = true;
        this.won = false;
        return saveScore(highest_tile);
      }
    };


    var getEmptyCellCount = function getEmptyCellCount() {
      var count = 0; 
      board.forEach(function(row) {
        row.forEach(function(cell) {
          if(cell === 0) {
            count++;
          }
        }); 
      });
      return count;
    };

    this.placeNewSquare = function placeNewSquare() {
      var count = getEmptyCellCount(); 
      var random_cell = Math.floor(Math.random() * count);
      var current_count = 0;
      for(var row = 0, len = board.length; row < len; row++) {
        for(var column = 0, leng = board[row].length; column < leng; column++) {
          if(board[row][column] === 0) { 
            if(current_count == random_cell) {
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

    this.placeNewSquare();

  };

  Game.prototype.move = function move(direction) {
    var board = this.getBoard();
    var changed = false;
    if(direction === 'up') {
      for(var column = 0, len = board.length; column < len; column++) {
        var current_column = this.getBoardColumn(column); 
        var adjusted_column = [];
        var padding = [];
        for(var row = 0, leng = current_column.length; row < leng; row++) {
          var is_not_zero = !(current_column[row] === 0);
          if( is_not_zero && 
             row + 1 < leng && 
             current_column[row] === current_column[row + 1] 
          ) {
           adjusted_column.push(current_column[row] * 2); 
           padding.push(0); 
           row ++;
          } else if(is_not_zero) {
           adjusted_column.push(current_column[row]); 
          } else {
            padding.push(0); 
          }
        }
        var new_column = adjusted_column.concat(padding);
        if(!(new_column.join('|') === current_column.join('|'))) {
          changed = true; 
        }
        this.setBoardColumn(column, new_column);
      } 
    } else if(direction === 'down') {
      for(var column = 0, len = board.length; column < len; column++) {
        var current_column = this.getBoardColumn(column); 
        var adjusted_column = [];
        var padding = [];
        for(var row = 0, leng = current_column.length; row < leng; row++) {
          var is_not_zero = !(current_column[row] === 0);
          if( is_not_zero && 
             row + 1 < leng && 
             current_column[row] === current_column[row + 1] 
          ) {
           adjusted_column.push(current_column[row] * 2); 
           padding.push(0); 
           row ++;
          } else if(is_not_zero) {
           adjusted_column.push(current_column[row]); 
          } else {
            padding.push(0); 
          }
        }
        var new_column = padding.concat(adjusted_column);
        if(!(new_column.join('') === current_column.join(''))) {
          changed = true; 
        }
        this.setBoardColumn(column, new_column);
      } 
    } else if(direction === 'left') {
      for(var row = 0, len = board.length; row < len; row++) {
        var adjusted_row = [];
        var padding = [];
        for(var column = 0, leng = board[row].length; column < leng; column++) {
          var is_not_zero = !(board[row][column] === 0);
          if( is_not_zero && 
             column + 1 < leng && 
             board[row][column] === board[row][column + 1] 
          ) {
           adjusted_row.push(board[row][column] * 2); 
           padding.push(0); 
           column++;
          } else if(is_not_zero) {
           adjusted_row.push(board[row][column]); 
          } else {
            padding.push(0); 
          }
        }
        var new_row = adjusted_row.concat(padding); 
        if(!(new_row.join('') === board[row].join(''))) {
          changed = true; 
        }
        board[row] = new_row;
      } 
    } else if(direction === 'right') {
      for(var row = 0, len = board.length; row < len; row++) {
        var adjusted_row = [];
        var padding = [];
        for(var column = 0, leng = board[row].length; column < leng; column++) {
          var is_not_zero = !(board[row][column] === 0);
          if( is_not_zero && 
             column + 1 < leng && 
             board[row][column] === board[row][column + 1] 
          ) {
           adjusted_row.push(board[row][column] * 2); 
           padding.push(0); 
           column++;
          } else if(is_not_zero) {
           adjusted_row.push(board[row][column]); 
          } else {
            padding.push(0); 
          }
        }
        var new_row = padding.concat(adjusted_row); 
        if(!(new_row.join('') === board[row].join(''))) {
          changed = true; 
        }
        board[row] = new_row;
      } 
    }
    if(changed) this.placeNewSquare();
    this.checkWon();
  };

  Game.prototype.reset = function reset() {
    var new_board = [
      [0, 0, 0, 0], 
      [0, 0, 0, 0], 
      [0, 0, 0, 0], 
      [0, 0, 0, 0]
    ];

    this.setBoard(new_board);
    this.over = false;
    this.won = false;
    this.placeNewSquare();
  };

  Game.prototype.save = function save(save_name) {
    var self = this;
    return $http.put('/api/games', {
      board: self.getBoard(),
      name: save_name
    })
  };

  Game.prototype.load = function load(load_name) {
    var self = this;
    return $http.get('/api/games/' + load_name);
  };

	return Game;

});
