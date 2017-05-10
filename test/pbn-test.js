'use strict';

var bridge = require('../');
var card = bridge.card;
var seat = bridge.seat;
var pbn = bridge.pbn;
var Hand = bridge.Hand;
var expect = require('chai').expect;

describe('PBN', function() {

    it('should export hands as a deal', function() {
        var deal = {};
        deal[seat.north] = Hand.parsePBN('A843.QJ6.K.A6542');
        deal[seat.east] = Hand.parsePBN('KQ9752.K74.8742.');
        deal[seat.south] = Hand.parsePBN('T.A93.QT93.KJ873');
        deal[seat.west] = Hand.parsePBN('J6.T852.AJ65.QT9');

        var s = pbn.exportDeal(deal, seat.east);
        expect(s).to.equal("E:KQ9752.K74.8742. T.A93.QT93.KJ873 J6.T852.AJ65.QT9 A843.QJ6.K.A6542");
    });

});
