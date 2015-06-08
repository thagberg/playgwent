var cards = {};

exports.effects = {
    weatherClear: 0,
    weatherSnow: 1,
    weatherFog: 2,
    weatherRain: 3
};

exports.factions = {
    northern: 0,
    nilfgaard: 1,
    squirrel: 2,
    monster: 3,
    neutral: 4
};

exports.types = {
    close: 0,
    ranged: 1,
    siege: 2,
    special: 3
}

exports.Card = function(id, faction, title, text, type, hero, spy, alue, effect) {
    this.id = id;
    this.faction = faction;
    this.title = title;
    this.text = text;
    this.type = type;
    this.hero = hero;
    this.spy = spy;
    this.value = value;
    this.effect = effect;
};

