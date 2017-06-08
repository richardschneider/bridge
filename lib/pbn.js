/*
 * pbn.js
 * https://github.com/richardschneider/bridge
 *
 * Copyright (c) 2016 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

var seat = require('./seat');
var Hand = require('./hand');

function importDeal(pbn) {
    var deal = {};
    var dealer = seat[pbn[0]];
    var hands = pbn.slice(2).split(' ');
    var i;

    for (i = 0; i < 4; ++i) {
        deal[dealer] = Hand.parsePBN(hands[i]);
        dealer = dealer.next;
    }
    return deal;
}

function exportDeal(deal, dealer) {
    dealer = dealer || seat.south;
    var pbn = dealer.symbol + ':';
    var i;

    for (i = 0; i < 4; ++i) {
        if (i !== 0) {
            pbn = pbn + ' ';
        }
        pbn = pbn + deal[dealer].toPBN();
        dealer = dealer.next;
    }
    return pbn;
}

module.exports = {
    importDeal: importDeal,
    exportDeal: exportDeal
};
