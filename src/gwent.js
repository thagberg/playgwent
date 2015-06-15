(function() {
    var restify = require('restify');
    var loki = require('lokijs');
    var bunyan = require('bunyan');
    var card = require('./card');
    var globals = require('./global');

    var log = bunyan.createLogger({
        name: "PlayGwent",
        //stream: 'process.stdout',
        level: 'debug'
    });

    var serverOptions = {
        name: 'PlayGwent',
        log: log
    };

    var server = restify.createServer(serverOptions);

    var gwentDb = new loki('data.json', {autoload: true, autoloadCallback: function() {console.log("DB loaded");}});
    var games, players, cards;
    gwentDb.loadDatabase({}, function() {
        games = gwentDb.getCollection('games');
        players = gwentDb.getCollection('players');
        cards = gwentDb.getCollection('cards');
        cards.ensureUniqueIndex('id');
    });

    function determinePlayerOrder(gameId) {
        var thisgame = games.get(gameId);
        var order = Math.round(Math.random());
        thisGame.turnOrder = order;
        games.update(thisGame);
        return order;
    };

    function getPlayerCards(playerId) {
        var thisPlayer = players.get(playerId);
        return thisPlayer.cards;
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
        if (thisGame.hands === undefined) {
            thisGame.hands = {};
        }
        if (thisGame.hands[playerId] === undefined) {
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
        return thisGame.hands[playerId];
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
        var retCards = [];
        for (var i = 0; i < numberToDraw; i++) {
            var thisCard = thisDeck.shift();
            thisHand.cards.push(thisCard);
            retCards.push(thisCard);
        }
        games.update(thisGame);
        return retCards;
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
        var newGame = games.insert({players: {}, decks: {}});
        return newGame['$loki'];
    };

    function connectToGame(gameId, playerId) {
        var thisGame = games.get(gameId);
        if (Object.keys(thisGame.players).length < 2) {
            thisGame.players[playerId] = {
                playerNumber:  Object.keys(thisGame.players).length + 1
            }
            games.update(thisGame);
        } else {
            console.log("Game already full: ", gameId, playerId);
            console.log(thisGame);
            console.log(thisGame.players.length);
        }
    };

    function shuffleDeck(gameId, playerId) {
        var thisDeck = getDeck(gameId, playerId);
        for (var i = thisDeck.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i - 0));
            var tmp = thisDeck[i];
            thisDeck[i] = thisDeck[j];
            thisDeck[j] = tmp;
        }
        setDeck(gameId, playerId, thisDeck);
        return thisDeck;
    };

    function getPlayer(playerId) {

    };

    function createPlayer(playerName) {
        var newPlayer = players.insert({
            name: playerName,
            cards: ['redFoot', 
                    'catapult', 
                    'dethmold', 
                    'trebuchet', 
                    'ballista', 
                    'siegeTower', 
                    'ves', 
                    'siegfried',
                    'keira',
                    'sile',
                    'stennis',
                    'crinfrid',
                    'dunMedic',
                    'sigismund']
        });
        return newPlayer['$loki'];
    };


    // server routes

    server.get('hello', function(req, res, next) {
        res.send("hello");
        return next();
    });

    server.get('somecards', function(req, res, next) {
        var newGameId = startGame();
        var newPlayerId = createPlayer("Test");
        connectToGame(newGameId, newPlayerId);
        var playerCards = players.get(newPlayerId).cards;
        console.log(playerCards);
        setDeck(newGameId, newPlayerId, playerCards);
        shuffleDeck(newGameId, newPlayerId);
        var playerDeck = getDeck(newGameId, newPlayerId);
        console.log(playerDeck);
        var retCards = [];
        var hand = getHand(newGameId, newPlayerId);
        for (var i = 0; i < hand.cards.length; i++) {
            var thisCard = cards.by('id', hand.cards[i]);
            retCards.push(thisCard);
        }
        res.send({cards: retCards});
        return next();
    });

    server.get('draw/:gameId/:playerId', function(req, res, next) {
        console.log("Drawing card: ", req.params.gameId, req.params.playerId);
        var cards = drawCard(req.params.gameId, req.params.playerId, 1);
        //res.send({gameId: req.params.gameId, playerId: req.params.playerId});
        res.send({cards: cards});
        return next();
    });

    server.get(/./, restify.serveStatic({
        directory: './client',
        default: 'index.html'
    }));

    server.on('uncaughtException', function(req, res, route, err) {
        console.log(err, err.stack);
        res.send(err, err.stack);
    });

    server.listen(8080, function() {
        console.log("%s listening at %s", server.name, server.url);
    });

})();