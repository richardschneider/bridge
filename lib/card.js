/*
 * card.js
 * https://github.com/richardschneider/bridgejs
 *
 * Copyright (c) 2015 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

var rankOffset = {
    '2': 1,
    '3': 2,
    '4': 3,
    '5': 4,
    '6': 5,
    '7': 6,
    '8': 7,
    '9': 8,
    '10': 9,
    'J': 10,
    'Q': 11,
    'K': 12,
    'A': 13
};

var suitOffset = {
    'C': 0 * 13,
    'D': 1 * 13,
    'H': 2 * 13,
    'S': 3 * 13
};

function Card(rank, suit) {
    this.rank = rank;
    this.suit = suit;
    this.order = rankOffset[this.rank] + suitOffset[this.suit];
}

Card.prototype.imageUrl = function() {
    return 'cards/' + this.rank + this.suit + '.svg';
};

var cards = {all: []};
for (var rank in rankOffset) {
    for (var suit in suitOffset) {
        var card = new Card(rank, suit);
        cards.all.push(card);
        cards[rank + suit] = card;
        cards[suit + rank] = card;
        if (rank === '10') {
            cards['T' + suit] = card;
            cards[suit + 'T'] = card;
        }
    }
}

module.exports = cards;
