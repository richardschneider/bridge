/*
 * deck.js
 * https://github.com/richardschneider/bridgejs
 *
 * Copyright (c) 2015 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

var card = require('./card');
var seat = require('./seat');
var Hand = require('./hand');
var shuffle = require('crypto-shuffle');

/***
 * All 52 playing cards, sometimes called a pack.
 ***/
function Deck() {
    this.cards = card.all.slice();
}

/** Randomises the cards using the Fisher-Yates shuffle algorithm. */
Deck.prototype.shuffle = function() {
    shuffle(this.cards);
    return this;                        // for a fluent style.
};

/** Generates a hand for each seat. */
Deck.prototype.deal = function(dealer) {
    var player = dealer,
        hands = {};
    hands[seat.north] = new Hand();
    hands[seat.south] = new Hand();
    hands[seat.east] = new Hand();
    hands[seat.west] = new Hand();
    for (var i = 0; i < this.cards.length; ++i)
    {
        player = player.next;
        hands[player].cards.push(this.cards[i]);
    }
    hands[seat.north].sort();
    hands[seat.south].sort();
    hands[seat.east].sort();
    hands[seat.west].sort();
    return hands;
};

module.exports = Deck;
