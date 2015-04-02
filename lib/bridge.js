/*
 * Bridge.JS
 * https://github.com/richardschneider/bridgejs
 *
 * Copyright (c) 2015 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

var model = {};
module.exports = model;

/*
 * Card
 */
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

model.card = cards;

/*
 * Bid
 */
var denominationOffset = {
        'C': 1,
        'D': 2,
        'H': 3,
        'S': 4,
        'NT': 5,
    };

function Bid(s) {
    this.level = (+(s.charAt(0))) || undefined;
    this.denomination = this.level ? s.substr(1) : undefined;
    this.order = ((this.level - 1) * 5) + denominationOffset[this.denomination];
    this.isDouble = s === 'X';
    this.isRedouble = s === 'XX';
    this.isPass = s === '-' || s === 'P' || s === '/' || s === 'Pass';
    this.isRed = this.denomination === 'H' || this.denomination === 'D';
    this.isBlack = this.denomination === 'S' || this.denomination === 'C';
}

Bid.prototype.toString = function() {
    if (this.isPass) {
        return '-';
    } else if (this.isDouble) {
        return 'X';
    } else if (this.isRedouble) {
        return 'XX';
    }

    return this.level + this.denomination;
};

model.bid = {
    '-': new Bid('-'),
    'X': new Bid('X'),
    'XX': new Bid('XX'),
    '1C': new Bid('1C'),
    '1D': new Bid('1D'),
    '1H': new Bid('1H'),
    '1S': new Bid('1S'),
    '1NT': new Bid('1NT'),
    '2C': new Bid('2C'),
    '2D': new Bid('2D'),
    '2H': new Bid('2H'),
    '2S': new Bid('2S'),
    '2NT': new Bid('2NT'),
    '3C': new Bid('3C'),
    '3D': new Bid('3D'),
    '3H': new Bid('3H'),
    '3S': new Bid('3S'),
    '3NT': new Bid('3NT'),
    '4C': new Bid('4C'),
    '4D': new Bid('4D'),
    '4H': new Bid('4H'),
    '4S': new Bid('4S'),
    '4NT': new Bid('4NT'),
    '5C': new Bid('5C'),
    '5D': new Bid('5D'),
    '5H': new Bid('5H'),
    '5S': new Bid('5S'),
    '5NT': new Bid('5NT'),
    '6C': new Bid('6C'),
    '6D': new Bid('6D'),
    '6H': new Bid('6H'),
    '6S': new Bid('6S'),
    '6NT': new Bid('6NT'),
    '7C': new Bid('7C'),
    '7D': new Bid('7D'),
    '7H': new Bid('7H'),
    '7S': new Bid('7S'),
    '7NT': new Bid('7NT'),
};
model.bid.pass = model.bid['-'];
model.bid.double = model.bid['X'];
model.bid.redouble = model.bid['XX'];

/*
 * Contract
 */
function Contract() {
    this.risk = '';  // '', 'X' or 'XX'
    this.level = 0;  // 1 - 7, 0 is 'passed in'
    this.denomination = undefined; // 'S', 'H', 'D', 'C' or 'NT'
    this.declaror = undefined;  // a seat
}

Contract.prototype.toString = function() {
    if (this.level === 0) {
        return '-';
    }
    return this.level +
        this.denomination +
        this.risk +
        ' by ' + this.declaror;
};

model.Contract = Contract;

/*
 * Tick
 */
function Trick() {
    this.play = [];  // each object has a card and seat property.
}

Trick.prototype.leader = function() {
    return this.play.length < 1 ? undefined : this.play[0].seat;
};

Trick.prototype.winner = function(contract) {
    if (this.play.length < 4) {
        return undefined;
    }

    var play, bestSeat, bestOrder = -10000, order;
    for (var i = 0; i < 4; ++i)
    {
        play = this.play[i];
        order = play.card.order;
        if (play.card.suit === contract.denomination) {
            order *= 1000;
        }
        if (order > bestOrder) {
            bestOrder = order;
            bestSeat = play.seat;
        }
    }

    return bestSeat;
};

model.Trick = Trick;

/*
 * Seat
 */
function Seat() {
    this.symbol = '';
}

Seat.prototype.toString = function() {
    return this.symbol;
};

var seat = model.seat = {
    north: new Seat(),
    east: new Seat(),
    south: new Seat(),
    west: new Seat()
};

seat.north.symbol = 'N';
seat.north.partner = seat.south;
seat.north.rho = seat.west;
seat.north.lho = seat.east;
seat.north.next = seat.east;

seat.south.symbol = 'S';
seat.south.partner = seat.north;
seat.south.rho = seat.east;
seat.south.lho = seat.west;
seat.south.next = seat.west;

seat.east.symbol = 'E';
seat.east.partner = seat.west;
seat.east.rho = seat.north;
seat.east.lho = seat.south;
seat.east.next = seat.south;

seat.west.symbol = 'W';
seat.west.partner = seat.east;
seat.west.rho = seat.south;
seat.west.lho = seat.north;
seat.west.next = seat.north;

seat.N = seat.north;
seat.S = seat.south;
seat.E = seat.east;
seat.W = seat.west;

