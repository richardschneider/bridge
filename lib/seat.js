/*
 * seat.js
 * https://github.com/richardschneider/bridgejs
 *
 * Copyright (c) 2015 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

/*
 * Seat
 */
function Seat() {
    this.symbol = '';
}

Seat.prototype.toString = function() {
    return this.name;
};

var seat = {
    north: new Seat(),
    east: new Seat(),
    south: new Seat(),
    west: new Seat()
};

seat.north.symbol = 'N';
seat.north.name = 'north';
seat.north.partner = seat.south;
seat.north.rho = seat.west;
seat.north.lho = seat.east;
seat.north.next = seat.east;

seat.south.symbol = 'S';
seat.south.name = 'south';
seat.south.partner = seat.north;
seat.south.rho = seat.east;
seat.south.lho = seat.west;
seat.south.next = seat.west;

seat.east.symbol = 'E';
seat.east.name = 'east';
seat.east.partner = seat.west;
seat.east.rho = seat.north;
seat.east.lho = seat.south;
seat.east.next = seat.south;

seat.west.symbol = 'W';
seat.west.name = 'west';
seat.west.partner = seat.east;
seat.west.rho = seat.south;
seat.west.lho = seat.north;
seat.west.next = seat.north;

seat.N = seat.north;
seat.S = seat.south;
seat.E = seat.east;
seat.W = seat.west;

seat.distance = function (a, b) {
    if (a === b) {
        return 0;
    }
    if (a.lho === b) {
        return 1;
    }
    if (a.partner === b) {
        return 2;
    }
    return 3;
};

module.exports = seat;
