
function Game() {
    this.players = {};    
    this.table = {};
    this.decks = {};
    this.hands = {};
    this.discards = {};

    this.setPlayers = function(players) {
        for (var player of players) {
            this.players[player.id] = player;
        }
    };

    this.addPlayer = function(player) {
        this.players[player.id] = player;
        if (this.hands[player.id] === undefined) {
            this.hands[player.id] = [];
        }
    };

    this.setDecks = function(decks) {
        for (var deck of decks) {
            this.decks[deck.id] = deck.cards;
        }
    };

    this.setTable = function(tableSize) {
        for (var i = 0; i < tableSize; i++) {
            for (var j = 0; j < tableSize; j++) {
                var alpha = String.fromCharCode(65 + i);
                var num = j;
                var gridString = alpha + "-" + num;
                this.table[gridString] = [];
            }
        }
    };

    this.playCard = function(playerId, card, tableGrid, faceDown) {
        var player = this.players[playerId];
        var playerHand = this.hands[playerId];
        if (faceDown === undefined) {
            faceDown = true;
        }

        // remove the card from the player's hand
        if (card in playerHand) {
            delete playerHand[card];
        }

        card.faceDown = faceDown;

        this.table[tableGrid].push(card);
    };

    this.discardCard = function(playerId, card, tableGrid) {
        this.playCard(playerId, card, tableGrid, true);
    };

    this.drawCards = function(playerId, deckId, numberToDraw) {
        var player = this.players[playerId];
        var playerHand = this.hands[playerId];
        var deck = this.decks[deckId];

        var drawnCards = deck.splice(0, numberToDraw);
        this.hands[playerId] = playerHand.concat(drawnCards);
    };

    this.passCardsToPlayer = function(passerId, receiverId, cards) {
        var passer = this.players[passerId];
        var receiverId = this.players[receiverId];
        var passerHand = this.hands[passerId];
        var receiverHand = this.hands[receiverId];

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            for (var j = 0; j < passerHand.length; j++) {
                if (passerHand[j].id === card.id) {
                    passerHand.splice(j, 1);
                    break;
                }
            }
            receiverHand.push(card);
        }
    };

    this.drawCardFromPlayer = function(drawerId, draweeId, cardIndex) {
        var drawer = this.players[drawerId];
        var drawee = this.players[draweeId];
        var drawerHand = this.hands[drawerId];
        var draweeHand = this.hands[draweeId];

        if (cardIndex <= draweeHand.length-1) {
            var drawnCards = draweeHand.splice(cardIndex, 1);
            drawerHand.push(drawnCards[0]);``
        }
    };

    this.moveCardOnTable = function(card, oldGrid, newGrid) {
        var movedCard;
        for (var i = 0; i < this.table[oldGrid].length; i++) {
            if (this.table[oldGrid][i].id === card.id) {
                movedCard = this.table[oldGrid].splice(i, 1);
                break;
            }
        }
        this.table[neGrid].push(movedCard[0]);
    };

    this.moveTopCardOnTable = function(oldGrid, newGrid) {
        var movedCard = this.table[oldGrid].splice(0, 1);
        this.table[newGrid].push(movedCard[0]);
    };

    this.flipCardOnTable = function(card, tableGrid, faceDown) {
        for (var i = 0; i < this.table[tableGrid].length; i++) {
            if (this.table[tableGrid][i].id === card.id) {
                this.table[tableGrid][i].faceDown = faceDown; 
                break;
            }
        }
    };

    this.flipTopCardOnTable = function(tableGrid, faceDown) {
        this.table[tableGrid][0].faceDown = faceDown;
    };

    this.shuffleDeck = function(deckId) {
        var deck = this.decks[deckId];
        for (var i = deck.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i - 0));
            var tmp = deck[i];
            deck[i] = deck[j];
            deck[j] = tmp;
        }
    };
}

module.exports = Game;
