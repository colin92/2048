app.config(function ($stateProvider) {
    $stateProvider.state('game', {
        url: '/game',
        templateUrl: '/pre-build/game/game.html',
        controller: 'GameController',
        resolve: {
          scores: function($http) {
            return $http.get('/api/games/score').then(function(response) {
              return response.data; 
            });
          } 
        }
    });
});
