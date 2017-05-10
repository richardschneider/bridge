/*
 * hand.js
 * https://github.com/richardschneider/bridgejs
 *
 * Copyright (c) 2015 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

var cards = require('./card');

/** A player's cards and inferred facts. */
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

var pbnOrder = {
  S: 'H',
  H: 'D',
  D: 'C',
  C: null
};

Hand.prototype.toPBN = function () {
    if (this.cards.length === 0) {
      return '-';
    }

    var s = '',
        suit = 'S',
        i;
    this.sort();
    for (i = 0; i < this.cards.length; ++i) {
        var card = this.cards[i];
        while (card.suit !== suit) {
          s += '.';
          suit = pbnOrder[suit];
        }
        s += card.rank;
    }
    while(pbnOrder[suit] !== null) {
          s += '.';
          suit = pbnOrder[suit];
    }

    return s;
};

Hand.parsePBN = function (pbn) {
    var hand = new Hand();

    if (pbn === '-') {
        return hand;
    }
    if (pbn.split('.').length !== 4) {
      throw new Error("All four suits must be declared.");
    }

    var suit = 'S', rank, i;
    for (i = 0; i < pbn.length; ++i) {
        rank = pbn[i];
        if (rank === '.') {
            suit = pbnOrder[suit];
        } else {
          hand.cards.push(cards[rank + suit]);
        }
    }

  return hand;
};

module.exports = Hand;
