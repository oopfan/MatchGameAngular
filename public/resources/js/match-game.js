(function() {
  var app = angular.module('ngMatchGame', []);

  /*
    The controller is responsible for creating the game state
    which is used by the four directives defined below it.
  */
  app.controller('ngMatchGameController', function($scope) {
    /*
      This method is called by the 'New Game' button
    */
    $scope.newGame = function() {
      $scope.gameState = newGame();
    };
    /*
      This method is called by the 'Restart Game' button
    */
    $scope.restartGame = function() {
      $scope.gameState = restartGame();
    };

    // Make the initial state and new game.
    $scope.newGame();

    /*
      Create the game state for a new game (i.e. all new shuffled cards).
    */
    function newGame() {
      return {
        cards: generateCards(),
        selected: [],
        solved: 0
      };
    }

    /*
      Generate game state for the current game restarted.
    */
    function restartGame() {
      var cards = angular.copy($scope.gameState.cards);
      cards.forEach(function(card) {
        card.cardState = 'hidden';
      });
      return {
        cards: cards,
        selected: [],
        solved: 0
      };
    }

    /*
      Generate and return an object containing matching card values
      with initial state of hidden.
    */
    function generateCards() {
      var cardValues = generateCardValues();
      var cards = cardValues.map(function(cardValue) {
        return {
          cardValue: cardValue,
          cardState: 'hidden'
        }
      });
      return cards;
    }

    /*
      Generate and return an array of matching card values.
    */
    function generateCardValues() {
      var orderedCards = [];
      for (var i = 1; i <= 8; i++) {
        orderedCards.push(i);
        orderedCards.push(i);
      }
      var randomCards = [];
      while (orderedCards.length > 0) {
        var randomIndex = getRandomInt(0, orderedCards.length);
        randomCards.push(orderedCards[randomIndex]);
        orderedCards.splice(randomIndex, 1);
      }
      return randomCards;
    }

    /*
      Random integers given a range thanks to Mozilla
    */
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

  });

  /*
    A directive that watches for a solved game.
    It immediately changes the CSS 'display' property to 'flex',
    and then waits 2 seconds before changing it to 'none'.
  */
  app.directive('youWon', function($timeout) {
    return {
      restrict: 'C',
      scope: {
        gameState: '='
      },
      link: function(scope, element, attrs) {
        scope.$watch('gameState.solved', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            if (newValue == 16) {
              element[0].style.display = 'flex';
              $timeout(function() {
                element[0].style.display = 'none';
              }, 2000);
            }
          }
        });
      }
    };
  });

  /*
    A directive that watches for a solved game.
    It immediately changes the CSS 'opacity' property to '0.1',
    and then waits 2 seconds before changing it to '1'.
  */
  app.directive('matchGame', function($timeout) {
    return {
      restrict: 'C',
      scope: {
        gameState: '='
      },
      link: function(scope, element, attrs) {
        scope.$watch('gameState.solved', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            if (newValue == 16) {
              element[0].style.opacity = '0.1';
              $timeout(function() {
                element[0].style.opacity = '1';
              }, 2000);
            }
          }
        });
      }
    };
  });

  /*
    This directive represents the game.
  */
  app.directive('game', function($timeout) {
    return {
      restrict: 'C',
      replace: true,
      template: '<div class="row"><card ng-repeat="card in gameState.cards" ng-click="cardClick(card, $index)" card-value="{{card.cardValue}}" card-state="{{card.cardState}}"></card></div>',
      scope: {
        gameState: '='
      },
      link: function(scope, element, attrs) {
        /*
          Flips over a given card and checks to see if two cards are flipped over.
          Updates styles on flipped cards depending whether they are a match or not.
        */
        scope.cardClick = function(card, cardIndex) {
          // Test if this card is already flipped
          if (card.cardState !== 'hidden') {
            // Yes, so then return
            return;
          }

          // Prevent more than 2 flipped cards
          if (scope.gameState.selected.length >= 2) {
            return;
          }

          // Show that this card is now selected
          card.cardState = 'selected';
          scope.gameState.selected.push(cardIndex);

          // Test if we have two selected cards
          if (scope.gameState.selected.length < 2) {
            // No, so then return
            return;
          }

          // Test if both selected cards have the same value
          if (scope.gameState.cards[scope.gameState.selected[0]].cardValue === card.cardValue) {
            // Yes they do, change colors to reflect this
            scope.gameState.cards[scope.gameState.selected[0]].cardState = 'solved';
            card.cardState = 'solved';
            // Bump the total number of cards flipped
            scope.gameState.solved += 2;
            scope.gameState.selected = [];
            return;
          }

          // The cards have different values
          $timeout(function() {
            // Hide the cards after a half second delay
            scope.gameState.cards[scope.gameState.selected[0]].cardState = 'hidden';
            card.cardState = 'hidden';
            scope.gameState.selected = [];
          }, 500);

        };
      }
    };
  });

  /*
    This directive represents the game card.
  */
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
        /*
          Watch for changes in the card state (i.e. 'hidden', 'selected', and 'solved')
          that the game directive will make.
        */
        scope.$watch('cardState', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            update();
          }
        });
        update();
        function update() {
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
      }
    };
  });

})();
