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

    cards.insert({
        id: 'redFoot',
        faction: card.factions.northern,
        title: 'Redanian Foot Soldier',
        text: "I've bled for Redania! I've killed for Redania... Damnit, I've even raped for Redania!",
        type: card.types.close,
        hero: false,
        spy: false,
        value: 1,
        effect: undefined
    });

    cards.insert({
        id: 'catapult',
        faction: card.factions.northern,
        title: 'Catapult',
        text: "The gods help those who have better catapults",
        type: card.types.siege,
        hero: false,
        spy: false,
        value: 8,
        effect: card.effects.brother
    });

    cards.insert({
        id: 'dethmold',
        faction: card.factions.northern,
        title: "Dethmold",
        text: "",
        type: card.types.ranged,
        hero: false,
        spy: false,
        value: 6,
        effect: undefined
    });

    cards.insert({
        id: 'trebuchet',
        faction: card.factions.northern,
        title: "Trebuchet",
        text: "",
        type: card.types.siege,
        hero: false,
        spy: false,
        value: 6,
        effect: undefined
    });

    cards.insert({
        id: 'ballista',
        faction: card.factions.northern,
        title: "Ballista",
        text: "",
        type: card.types.siege,
        hero: false,
        spy: false,
        value: 6,
        effect: undefined
    });

    cards.insert({
        id: 'siegeTower',
        faction: card.factions.northern,
        title: "Siege Tower",
        text: "",
        type: card.types.siege,
        hero: false,
        spy: false,
        value: 6,
        effect: undefined
    });

    cards.insert({
        id: 'ves',
        faction: card.factions.northern,
        title: "Ves",
        type: card.types.close,
        hero: false,
        spy: false,
        value: 5,
        effect: undefined
    });

    cards.insert({
        id: 'siegried',
        faction: card.factions.northern,
        title: "Siegfried of Denesle",
        type: card.types.close,
        hero: false,
        spy: false,
        value: 5,
        effect: undefined
    });

    cards.insert({
        id: 'keira',
        faction: card.factions.northern,
        title: "Keira Metz",
        type: card.types.ranged,
        hero: false,
        spy: false,
        value: 5,
        effect: undefined
    });

    cards.insert({
        id: 'sile',
        faction: card.factions.northern,
        title: "Sile de Tansarville",
        type: card.types.ranged,
        hero: false,
        spy: false,
        value: 5,
        effect: undefined
    });

    cards.insert({
        id: 'stennis',
        faction: card.factions.northern,
        title: "Prince Stennis",
        type: card.types.close,
        hero: false,
        spy: false,
        value: 5,
        effect: undefined
    });

    cards.insert({
        id: 'crinfrid',
        faction: card.factions.northern,
        title: "Crinfrid Reavers Dragon Hunter",
        type: card.types.ranged,
        hero: false,
        spy: false,
        value: 5,
        effect: card.effects.brother
    });

    cards.insert({
        id: 'dunMedic',
        faction: card.factions.northern,
        title: "Dun Banner Medic",
        type: card.types.siege,
        hero: false,
        spy: false,
        value: 5,
        effect: card.effects.medic
    });

    cards.insert({
        id: 'sigismund',
        faction: card.factions.northern,
        title: "Sigismund Dijkstra",
        type: card.types.close,
        hero: false,
        spy: true,
        value: 4,
        effect: undefined
    });

    gwentDb.save();
})();