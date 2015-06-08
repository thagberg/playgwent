(function() {
    var restify = require('restify');
    var loki = require('lokijs');
    var card = require('./card');
    var globals = require('./global');

    var gwentDb = new loki('data.json');
    var games = gwentDb.addCollection('games');
    var players = gwentDb.addCollection('players');
    var cards = gwentDb.addCollection('cards');

    console.log("Creating card entries...");
    console.log(card);

    debugger;

    cards.insert({
        id: 'redFood',
        faction: card.factions.northern,
        title: 'Redanian Foot Soldier',
        text: "I've bled for Redania! I've killed for Redania... Damnit, I've even raped for Redania!",
        type: card.types.close,
        hero: false,
        spy: false,
        value: 1,
        effect: undefined
    });

    gwentDb.save();
})();