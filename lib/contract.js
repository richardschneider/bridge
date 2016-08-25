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
    if (this.level === 0) {
        return '-';
    }
    return this.level +
        this.denomination +
        this.risk +
        ' by ' + this.declaror.symbol;
};

Contract.prototype.isPassedIn = function() { return this.level ===0; };

module.exports = Contract;
