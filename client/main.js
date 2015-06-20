require(['react', 
         'jquery',
         'cardComponent'], 
         function(React, 
                  $,
                  Card) {
    function startGame() {
        window.gameId;
        window.playerId;
        var tP = new Promise(function(resolve, reject) {
            function startNewGame() {
                var p = new Promise(function(resolve, reject) {
                    $.ajax({
                        url: "start",
                        success: function(data) {
                            window.gameId = data.gameId;
                            resolve();
                        }
                    });
                });
                return p;
            }
            function createNewPlayer() {
                var p = new Promise(function(resolve, reject) {
                    $.ajax({
                        url: "createPlayer/test",
                        success: function(data) {
                            window.playerId = data.playerId;
                            resolve();
                        }
                    });
                });
                return p;
            }
            function joinNewGame() {
                var p = new Promise(function(resolve, reject) {
                    $.ajax({
                        url: "join/" + window.gameId + "/" + window.playerId,
                        success: function(data) {
                            resolve();    
                        }
                    });
                });
                return p;
            }

            startNewGame()
                .then(createNewPlayer)
                .then(joinNewGame)
                .then(resolve);
        });
        
        return tP;
    }

    function renderCards(playerId, cards) {
        var renderedCards = [];
        for (var i = 0; i < cards.length; i++) {
            var thisCard = cards[i];
            renderedCards.push(
                React.createElement(Card, {playerId: window.playerId, 
                      cardId: thisCard.id, 
                      title: thisCard.title, 
                      text: thisCard.text, 
                      hero: thisCard.hero, 
                      spy: thisCard.spy, 
                      value: thisCard.value, 
                      faction: thisCard.faction})
            );
        }
        React.render(
            React.createElement("div", {id: "playerCards"}, 
                renderedCards
            ),
            document.getElementById("gameContent")
        );
    }

    function startAndPrepare() {
        function getAllCards() {
            var p = new Promise(function(resolve, reject) {
                $.ajax({
                    url: "cards/" + window.playerId,
                    success: function(data){
                        window.playerCards = data.cards;
                        resolve();
                    }
                })
            });
            return p;
        }

        startGame()
            .then(getAllCards)
            .then(function() {
                renderCards(window.playerId, window.playerCards);
            });
        // startGame().then(function() {

        //     React.render(
        //         <button onClick={drawCard}>Draw Card</button>,
        //         document.getElementById("gameContent")
        //     );
        // });
    }

    function drawCard() {
        console.log("Drawing card");
    }

    React.render(
        React.createElement("div", {id: "mainContent"}, 
            React.createElement("p", null, "Play Gwent Today!"), 
            React.createElement("button", {onClick: startAndPrepare}, "Start Game"), 
            React.createElement("div", {id: "gameContent"})
        ),
        document.getElementById("test")
            );
});
