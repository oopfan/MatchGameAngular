(function() {
  var app = angular.module('ngMatchGame', []);

  app.controller('ngMatchGameController', function($scope) {
    $scope.restartGame = function() {
      alert('You pressed the Restart Game button!');
    };
    $scope.newGame = function() {
      alert('You pressed the New Game button!');
    };
  });

  app.directive('game', function() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div class="row"><card ng-repeat="card in cards" card-value="{{card.value}}" card-state="{{card.state}}"></card></div>',
      scope: {
      },
      link: function(scope, element, attrs) {
        scope.cards = [
          { value: 5, state: 'selected' },
          { value: 2, state: 'selected' },
          { value: 5, state: 'selected' },
          { value: 4, state: 'selected' },
          { value: 1, state: 'selected' },
          { value: 6, state: 'selected' },
          { value: 3, state: 'selected' },
          { value: 2, state: 'selected' },
          { value: 7, state: 'selected' },
          { value: 4, state: 'selected' },
          { value: 6, state: 'selected' },
          { value: 1, state: 'selected' },
          { value: 8, state: 'selected' },
          { value: 3, state: 'selected' },
          { value: 8, state: 'selected' },
          { value: 7, state: 'selected' }
        ];
      }
    };
  });

  app.directive('card', function() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 card" ng-style="style"><span>{{spanValue}}</span></div>',
      scope: {
        cardValue: '@',
        cardState: '@'
      },
      link: function(scope, element, attrs) {
        var colors = [
          'hsl(25, 85%, 65%)',
          'hsl(55, 85%, 65%)',
          'hsl(90, 85%, 65%)',
          'hsl(160, 85%, 65%)',
          'hsl(220, 85%, 65%)',
          'hsl(265, 85%, 65%)',
          'hsl(310, 85%, 65%)',
          'hsl(360, 85%, 65%)',
        ];
        scope.style = {
          color: scope.cardState === 'solved' ? 'rgb(204, 204, 204)' : 'rgb(255, 255, 255)',
          backgroundColor: scope.cardState === 'solved' ? 'rgb(153, 153, 153)' : (scope.cardState === 'selected' ? colors[scope.cardValue - 1] : 'rgb(32, 64, 86)')
        }
        scope.spanValue = scope.cardState === 'hidden' ? '' : scope.cardValue;
      }
    };
  });

})();
