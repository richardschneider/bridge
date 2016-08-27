/*
 * hand.js
 * https://github.com/richardschneider/bridgejs
 *
 * Copyright (c) 2015 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

/** A player's cards and facts. */
function Hand() {
    this.cards = [];
    this.facts = [];
}

/** sort by descending order */
Hand.prototype.sort = function () {
    this.cards
        .sort(function (a, b) {
            return b.order - a.order;
        });
    return this;
};

Hand.prototype.cardsWithSuit = function (suit) {
    return this.cards
        .filter(function (card) {
            return card.suit === suit;
        });
};

Hand.prototype.toString = function () {
    var s = '',
        i;
    for (i = 0; i < this.cards.length; ++i) {
        if (i !== 0) {
            s += ' ';
        }
        s += this.cards[i].toString();
    }
    return s;
};

module.exports = Hand;
