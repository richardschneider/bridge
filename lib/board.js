/*
 * board.js
 * https://github.com/richardschneider/bridge
 *
 * Copyright (c) 2016 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

var seat = require('./seat');
var Hand = require('./hand');

var seats = [seat.north, seat.east, seat.south, seat.west];
var vuln = [
    'Nil', 'NS', 'EW', 'All',
    'NS', 'EW', 'All', 'Nil',
    'EW', 'All', 'Nil', 'NS',
    'All', 'Nil', 'NS', 'EW'
];

/*
 * Board
 */
function Board() {
    this.vulnerability = undefined;  // 'Nil', 'NS', 'EW' or 'All'
    this.dealer = undefined;  // a seat
    this.hands = {};
    this.hands[seat.north] = new Hand();
    this.hands[seat.east] = new Hand();
    this.hands[seat.south] = new Hand();
    this.hands[seat.west] = new Hand();
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

/***
 * Set the board number and calculate dealer and vulnerability.
 ***/
Board.prototype.setNumber = function(boardNumber) {
    this.number = boardNumber;
    this.dealer = seats[(boardNumber - 1) % 4];
    this.vulnerability = vuln[(boardNumber - 1) % 16];
    return this;
};

module.exports = Board;
