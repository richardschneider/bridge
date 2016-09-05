/*
 * board.js
 * https://github.com/richardschneider/bridge
 *
 * Copyright (c) 2016 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

var seat = require('./seat');

/*
 * Board
 */
function Board() {
    this.vulnerability = 'Nil';  // 'Nil', 'NS', 'EW' or 'All'
    this.dealer = undefined;  // a seat
    this.hands = {};
    this.hands[seat.north] = [];
    this.hands[seat.east] = [];
    this.hands[seat.south] = [];
    this.hands[seat.west] = [];
    this.number = 1;  // 1-relative to an event
}

/***
 * Determines if the seat is vulnerable.
 ***/
Board.prototype.isVulnerable = function(seat) {
    if (this.vulnerability === 'Nil') {
        return false;
    } else if (this.vulnerability === 'All') {
        return true;
    }
    else {
        return this.vulnerability.indexOf(seat.symbol) !== -1;
    }
};

module.exports = Board;
