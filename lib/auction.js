/*
 * auction.js
 * https://github.com/richardschneider/bridgejs
 *
 * Copyright (c) 2016 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

/** The history of bids. */
function Auction(dealer) {
    this.bids = [];
    this.dealer = dealer;
}

module.exports = Auction;
