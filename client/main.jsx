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
                <Card playerId={window.playerId} 
                      cardId={thisCard.id}
                      title={thisCard.title}
                      text={thisCard.text}
                      hero={thisCard.hero}
                      spy={thisCard.spy}
                      value={thisCard.value}
                      faction={thisCard.faction}></Card>
            );
        }
        React.render(
            <div id="playerCards">
                {renderedCards}
            </div>,
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
        <div id="mainContent">
            <p>Play Gwent Today!</p>
            <button onClick={startAndPrepare}>Start Game</button>
            <div id="gameContent"></div>
        </div>,
        document.getElementById("test")
            );
});