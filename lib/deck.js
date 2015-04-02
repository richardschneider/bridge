/*
 * deck.js
 * https://github.com/richardschneider/bridgejs
 *
 * Copyright (c) 2015 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

var card = require('./card');

/** 52 standard playing card */
function Deck() {
    this.cards = card.all.slice();
}

/** Randomises the cards using the Fisher-Yates shuffle algorithm. */
Deck.prototype.shuffle = function(rng) {
    rng = rng || Math.random;
    var cards = this.cards,
        n = cards.length,               // The number of items left to shuffle (loop invariant)
        k, t;
    while (n > 1) {
        k = Math.floor(rng() * n--);    // 0 <= k < n
        t = cards[n];                   // swap elements n and k
        cards[n] = cards[k];
        cards[k] = t;
    }
    return this;                        // for a fluent style.
};

module.exports = Deck;
