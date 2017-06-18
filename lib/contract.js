/*
 * contract.js
 * https://github.com/richardschneider/bridgejs
 *
 * Copyright (c) 2015 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

/***
 * The undertaking by declarer’s side to win, at the denomination named, the number of odd tricks
 * specified in the final bid, whether undoubled, doubled or redoubled.
 ***/
function Contract() {
    this.risk = '';  // '', 'X' or 'XX'
    this.level = 0;  // 1 - 7, 0 is 'passed in'
    this.denomination = undefined; // 'S', 'H', 'D', 'C' or 'NT'
    this.declaror = undefined;  // a seat
    this.made = undefined; // the number of tricks made over the book contract (6) or a negative number indicating the number of tricks down on the contract
}

Contract.prototype.toString = function() {
    if (this.isPassedIn()) {
        return '-';
    }
    var s = this.level +
        this.denomination +
        this.risk +
        ' by ' + this.declaror.symbol;
    if (this.made) {
        s += ' made ' + this.made;
    }
    return s;
};

Contract.prototype.isPassedIn = function() { return this.level === 0; };
Contract.prototype.dummy = function() { return this.declaror ? this.declaror.partner : undefined; };
Contract.prototype.leader = function() { return this.declaror ? this.declaror.lho : undefined; };
Contract.prototype.isOpponent = function(seat) { return seat !== this.declaror && seat !== this.dummy(); };

module.exports = Contract;
