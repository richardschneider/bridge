/*
 * pbn.js
 * https://github.com/richardschneider/bridge
 *
 * Copyright (c) 2016 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

var seat = require('./seat');

function importDeal() {
    throw new Error('NYI');
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
