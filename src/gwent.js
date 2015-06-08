(function() {
    var restify = require('restify');
    var loki = require('lokijs');
    var card = require('./card');
    var globals = require('./global');

    var serverOptions = {
        name: 'PlayGwent'
    };

    var server = restify.createServer(serverOptions);

    server.listen(8080, function() {
        console.log("%s listening at %s", server.name, server.url);
    });

    var gwentDb = new loki('data.json');
    var games = gwentDb.addCollection('games');
    var players = gwentDb.addCollection('players');
    var cards = gwentDb.addCollection('cards');

    function determinePlayerOrder(gameId) {
        var thisgame = games.get(gameId);
        var order = Math.round(Math.random());
        thisGame.turnOrder = order;
        games.update(thisGame);
        return order;
    };

    function getDeck(gameId, playerId) {
        var thisGame = games.get(gameId);
        //var thisPlayer = thisGame.players[playerId];
        return thisGame.decks[playerId];
    };

    function setDeck(gameId, playerId, deck) {
        var thisGame = games.get(gameId);
        thisGame.decks[playerId] = deck;
        games.update(thisGame);
    };

    function getHand(gameId, playerId) {
        var thisGame = games.get(gameId);
        var thisDeck = thisGame.decks[playerId];
        if (thisDeck.hands[playerId] == undefined) {
            var hand = [];
            for (var i = 0; i < 10; i++) {
                // pop the top 10 cards off the deck and put them in the hand
                hand.push(thisDeck.shift());
            }
            thisGame.hands[playerId] = {
                cards: hand,
                redraws: 0
            };
            games.update(thisGame);
        }
        return thisDeck.hands[playerId];
    };

    function swapCard(gameId, playerId, cardIndex) {
        var thisGame = games.get(gameId);
        var thisDeck = thisGame.decks[playerId];
        var thisHand = thisGame.hands[playerId];
        if (thisHand.redraws < globals.MAX_REDRAWS) {
            thisDeck.push(thisHand.cards[cardIndex]);
            thisHand.splice(cardIndex, 1);
            thisHand.cards.push(thisDeck.shift());
            thisHand.redraws++;
            games.update(thisGame);
        }
    };

    function drawCard(gameId, playerId, numberToDraw) {
        var thisGame = games.get(gameId);
        var thisDeck = thisGame.decks[playerId];
        var thisHand = thisGame.hands[playerId];
        for (var i = 0; i < numberToDraw; i++) {
            thisHand.cards.push(thisDeck.shift());
        }
        games.update(thisGame);
    };

    function playCard(gameId, playerId, cardIndex, row) {
        var thisGame = games.get(gameId);
        var thisHand = thisGame.hands[playerId];
        var thisBoard = thisGame.boards;
        var thisCard = thisHand.cards[cardIndex];

        // put card in its proper spot on board
        if (thisCard.spy) {
            // if it's a spy card, it should go on the opponent's side
            Object.keys(thisBoard.rows).forEach(function(thisPlayerId) {
                // finding the opponent's rows
                if (thisPlayerId !== playerId) {
                    thisBoard.rows[thisPlayerId][thisCard.type].push(thisCard);
                    thisHand.cards.splice(cardIndex, 1);
                    drawCard(gameId, playerId, globals.SPY_DRAW);
                }
            });

        } else if (thisCard.type === cards.types.special) {
            // if it's a special type, need to determine more
            // information before we know where to place it 

        } else {
            // normal combat card; should go to the proper
            // row on the player's side of the board
            thisBoard.rows[playerId][thisCard.type].push(thisHand.cards[cardIndex]);
            thisHand.cards.splice(cardIndex, 1);
        }

        // calculate scores
        Object.keys(thisBoard.rows).forEach(function(thisPlayerId) {
            var thisPlayerScore = 0;
            Object.keys(thisBoard.rows[thisPlayerId]).forEach(function(row) {
                thisPlayerScore += row.cards.reduce(function(rowScore, thisCard) {
                    // card score is (card value * row modifier + card bonus) * card modifier
                    // in this manner, a card which is doubled from a special effect
                    // is still worth 2 points even under bad weather
                    // Hero cards are not affected by special modifiers
                    var cardScore = thisCard.value;
                    if (!thisCard.hero) {
                        cardScore = (cardScore * row.modifier + thisCard.bonus) * thisCard.modifier;
                    }
                    return rowScore + cardScore;
                }, 0);
            });
            thisBoard.scores[thisPlayerId] = thisPlayerScore;
        });

        // update the game with new info
        games.update(thisGame);
    };

    function getGame(gameId) {

    };

    function getPlayerFromUsername(username) {
        var thisPlayer = players.find({username: username});
        if (thisPlayer === null) {
            throw "Invalid Username: " + username;
        }
        return thisPlayer;
    };

    function getPlayer(playerId) {
        var thisPlayer = players.get(playerId);
        if (thisPlayer === null) {
            throw "Invalid Player ID: " + payerId;
        }
        return thisPlayer;
    };

    function getPlayerCards(playerId) {
        var thisPlayer = getPlayer(playerId);
        return thisPlayer.cards;
    };

    function addToPlayerCards(playerId, card) {
        var thisPlayer = players.get(playerId);
    };

    function startGame() {
        var newGame = games.insert({players: {}});
        return newGame['$loki'];
    };

    function connectToGame(gameId, playerId) {
        var thisGame = games.get(gameId);
        if (thisGame.players.length < 2) {
            thisGame.players[playerId] = {
                playerNumber:  thisGame.players.length + 1
            }
        } else {
            console.log("Game already full: ", gameId, playerId);
        }
    };

    function shuffleDeck(gameId, playerId) {
        var thisDeck = getDeck(gameId, playerId);
        var deckCards = thisDeck.cards;
        for (var i = thisDeck.cards.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i - 0));
            var tmp = deckCards[i];
            deckCards[i] = deckCards[j];
            deckCards[j] = tmp;
        }
        setDeck(gameId, playerId, thisDeck);
        return thisDeck;
    };

    function getPlayer(playerId) {

    };

})();