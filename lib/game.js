/*
 * game.js
 * https://github.com/richardschneider/bridge
 *
 * Copyright (c) 2016 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

var bridge = require('./bridge');
var Auction = require('./auction');
var Contract = require('./contract');

/*
 * An organised bridge competition
 */
function Game() {
    this.auction = new Auction();
    this.contract = new Contract();
    this.tricks = [];
    this.players = {};
}

Game.prototype.play = function play(card) {
   var self = this, trick, seat;

    // Argument overloading
    if (arguments.length > 1) {
        card = Array.prototype.slice.call(arguments);
    }
    if (Array.isArray(card)) {
        var next;
        card.forEach(function(c) { next = self.play(c); });
        return next;
    }
    if (typeof card === 'string') {
        card = bridge.card[card];
    }

    if (this.tricks.length === 0) {
        trick = new bridge.Trick();
        this.tricks.push(trick);
        seat = this.contract.leader();
    } else {
        trick = this.tricks[this.tricks.length - 1];
        if (trick.play.length === 4) {
            seat = trick.winner(this.contract);
            trick = new bridge.Trick();
            this.tricks.push(trick);
        } else {
            seat = trick.play[trick.play.length - 1].seat.next;
        }
    }

    trick.play.push({ seat: seat, card: card});

    if (trick.play.length === 4) {
        return trick.winner(this.contract);
    }
    return seat.next;
};

module.exports = Game;
