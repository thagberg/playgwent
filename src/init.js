(function() {
    var loki = require('lokijs');
    var card = require('./card');
    var globals = require('./global');

    var cardDb = new loki('data.json');
    var games = cardDb.addCollection('games');
    var cards = cardDb.addCollection('cards');

    console.log("Creating card entries...");

    for (var suite in card.suites) {
        for (var value in card.values) {
            if (value !== card.values.joker) {
                cards.insert({
                    id: suite + '-' + value,
                    name: value + " of " + suite,
                    suite: card.suites[suite],
                    value: card.values[value]
                });
            }
        }
    }

    for (var i = 0; i < 2; i++) {
        cards.insert({
            id: 'joker',
            name: 'Joker',
            value: card.values.joker,
            suite: null
        });
    }

    cardDb.save();

})();