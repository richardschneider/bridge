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
Hand.prototype.sort = function() {
    this.cards.sort(function(a,b) {
        return b.order - a.order;
    });
};

Hand.prototype.toString = function() {
    var s = '';
    for(var i = 0; i < this.cards.length; ++i)
    {
        if (i != 0) {
            s += ' ';
        }
        s += this.cards[i].toString();
    }
    return s;
};

module.exports = Hand;
