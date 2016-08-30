(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.bridge = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = require('./lib/bridge');

},{"./lib/bridge":4}],2:[function(require,module,exports){
/*
 * auction.js
 * https://github.com/richardschneider/bridgejs
 *
 * Copyright (c) 2016 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

var bids = require('./bid');
var Contract = require('./contract');

/** The history of bids. */
function Auction(dealer) {
    this.bids = [];
    this.dealer = dealer;
}

Auction.prototype.bid = function(bid) {
    var self = this, seat, contract;

    // Argument overloading
    if (arguments.length > 1) {
        bid = Array.prototype.slice.call(arguments);
    }
    if (Array.isArray(bid)) {
        bid.forEach(function(b) { self.bid(b); });
        return;
    }
    if (typeof bid === 'string' || bid instanceof String) {
        bid = bids[bid];
    }
    if (typeof bid !== 'object' || Object.getPrototypeOf(bid).constructor.name !== 'Bid') {
        throw new Error('Invalid bid');
    }

    // Can the specified Bid be applied?
    if (this.isClosed()) {
        throw new Error('Bidding not allowed, auction is closed');
    }
    if (bid.isPass) {
        // you can always pass
    } else if (bid.isDouble) {
        seat = this.nextSeatToBid();
        contract = this.contract();
        if (contract.declaror === undefined) {
            throw new Error('Cannot double when opposition has no contract');
        }
        if (contract.declaror === seat.partner) {
            throw new Error('Doubling your partner is not allowed');
        }
        if (contract.risk !== '') {
            throw new Error('Opposition is already at risk');
        }
    } else if (bid.isRedouble) {
        seat = this.nextSeatToBid();
        contract = this.contract();
        if (!(contract.risk === 'X' && (seat === contract.declaror || seat.partner === contract.declaror))) {
            throw new Error('Invalid bid');
        }
    } else {
        var higherBids = this.bids.some(function(b) {return b.order > bid.order;});
        if (higherBids) {
            throw new Error('Insufficient bid');
        }
    }

    // All is okay
    this.bids.push(bid);
};

Auction.prototype.isClosed = function() {
    if (this.bids.length < 4) {
        return false;
    }

    return this.bids
        .slice(-3)
        .every(function(b) { return b === bids.pass; });
};

Auction.prototype.nextSeatToBid = function() {
    if (this.isClosed()) {
        return null;
    }

    return this.bids.reduce(function(seat) { return seat.next; }, this.dealer);
};

Auction.prototype.contract = function() {
    var seat = this.dealer;
    var contract = this.bids.reduce(function(contract, bid) {
        if (bid.isPass) {

        } else if (bid.isDouble) {
            contract.risk = 'X';
        } else if (bid.isRedouble) {
            contract.risk = 'XX';
        } else {
            contract.risk = '';
            contract.level = bid.level;
            contract.denomination = bid.denomination;
            contract.declaror = seat;
        }
        seat = seat.next;
        return contract;
    }, new Contract());

    // declaror is the first partner to bid the contract's denomination
    if (contract.declaror) {
        seat = this.dealer;
        for (var i = 0; i < this.bids.length; i++) {
            var bid = this.bids[i];
            if (bid.denomination === contract.denomination && (seat === contract.declaror || seat === contract.declaror.partner)) {
                contract.declaror = seat;
                break;
            }
            seat = seat.next;
        }
    }

    return contract;
};

module.exports = Auction;

},{"./bid":3,"./contract":6}],3:[function(require,module,exports){
/*
 * bid.js
 * https://github.com/richardschneider/bridgejs
 *
 * Copyright (c) 2015 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

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

var bid = {
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
bid.pass = bid['-'];
bid.double = bid['X'];
bid.redouble = bid['XX'];

module.exports = bid;

},{}],4:[function(require,module,exports){
/*
 * Bridge.JS
 * https://github.com/richardschneider/bridgejs
 *
 * Copyright (c) 2015 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

var model = module.exports = {};

model.card = require('./card');
model.bid = require('./bid');
model.seat = require('./seat');

model.Contract = require('./contract');
model.Trick = require('./trick');
model.Deck = require('./deck');
model.Hand = require('./hand');
model.Auction = require('./auction');

},{"./auction":2,"./bid":3,"./card":5,"./contract":6,"./deck":7,"./hand":8,"./seat":9,"./trick":10}],5:[function(require,module,exports){
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

Card.prototype.toString = function() {
    return this.rank + this.suit;
};

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

},{}],6:[function(require,module,exports){
/*
 * contract.js
 * https://github.com/richardschneider/bridgejs
 *
 * Copyright (c) 2015 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

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
    if (this.isPassedIn()) {
        return '-';
    }
    return this.level +
        this.denomination +
        this.risk +
        ' by ' + this.declaror.symbol;
};

Contract.prototype.isPassedIn = function() { return this.level === 0; };

module.exports = Contract;

},{}],7:[function(require,module,exports){
/*
 * deck.js
 * https://github.com/richardschneider/bridgejs
 *
 * Copyright (c) 2015 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

var card = require('./card');
var seat = require('./seat');
var Hand = require('./hand');

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

/** Generates a hand for each seat. */
Deck.prototype.deal = function(dealer) {
    var player = dealer,
        hands = {};
    hands[seat.north] = new Hand();
    hands[seat.south] = new Hand();
    hands[seat.east] = new Hand();
    hands[seat.west] = new Hand();
    for (var i = 0; i < this.cards.length; ++i)
    {
        player = player.next;
        hands[player].cards.push(this.cards[i]);
    }
    hands[seat.north].sort();
    hands[seat.south].sort();
    hands[seat.east].sort();
    hands[seat.west].sort();
    return hands;
};

module.exports = Deck;

},{"./card":5,"./hand":8,"./seat":9}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

module.exports = seat;

},{}],10:[function(require,module,exports){
/*
 * trick.js
 * https://github.com/richardschneider/bridgejs
 *
 * Copyright (c) 2015 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

/** A round in the game */
function Trick() {
    this.play = [];  // each object has a card and seat property.
}

/** The 1st seat to play a card */
Trick.prototype.leader = function() {
    return this.play.length < 1 ? undefined : this.play[0].seat;
};

/** The seat that has won the trick */
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

module.exports = Trick;

},{}]},{},[1])(1)
});
