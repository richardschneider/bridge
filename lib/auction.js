/*
 * auction.js
 * https://github.com/richardschneider/bridgejs
 *
 * Copyright (c) 2016 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

var bids = require('./bid');

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

module.exports = Auction;
