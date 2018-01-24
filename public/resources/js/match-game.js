(function() {
  angular.module('ngMatchGame', []).controller('ngMatchGameController', function($scope) {
      $scope.restartGame = function() {
        alert('You pressed the Restart Game button!');
      };
      $scope.newGame = function() {
        alert('You pressed the New Game button!');
      };
    });
})();
