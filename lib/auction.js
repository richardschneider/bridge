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
    var self = this;

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
    if (!bid || Object.getPrototypeOf(bid).constructor.name !== 'Bid') {
        throw new Error('Invalid bid');
    }

    // Can the specified Bid be applied?
    if (this.isClosed()) {
        throw new Error('Bidding not allowed, auction is closed');
    }
    if (bid.isPass) {
        // you can always pass
    }
    else if (bid.isDouble) {
        var seat = this.nextSeatToBid();
        var contract = this.contract();
        if (contract.declaror === undefined) {
            throw new Error('Cannot double when opposition has no contract');
        }
        if (contract.declaror === seat.partner) {
            throw new Error('Doubling your partner is not allowed');
        }
        if (contract.risk !== '') {
            throw new Error('Opposition is already at risk');
        }
    }
    else if (bid.isRedouble) {

    }
    else {
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

        }
        else if (bid.isDouble) {
            contract.risk = 'X';
        }
        else if (bid.isRedouble) {
            contract.risk = 'XX';
        }
        else {
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
