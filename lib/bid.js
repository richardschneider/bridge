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
