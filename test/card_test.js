'use strict';

var bridge = require('../');
var expect = require('chai').expect;

describe('Card', function() {

    it('has rank and suit', function() {
        var card = bridge.card['2S'];
        expect(card.rank).to.equal('2');
        expect(card.suit).to.equal('S');
    });

    it('rank can be 10 or T', function() {
        var card = bridge.card['10S'];
        expect(card.rank).to.equal('10');
        expect(card.suit).to.equal('S');

        card = bridge.card['TS'];
        expect(card.rank).to.equal('10');
        expect(card.suit).to.equal('S');
    });

    it('is ordered by suit', function() {
        var club = bridge.card['AC'];
        var diamond = bridge.card['AD'];
        var heart = bridge.card['AH'];
        var spade = bridge.card['AS'];
        expect(club.order).below(diamond.order);
        expect(diamond.order).below(heart.order);
        expect(heart.order).below(spade.order);
    });

    it('is ordered by rank within suit', function() {
        var S2 = bridge.card['2S'];
        var S3 = bridge.card['3S'];
        var S4 = bridge.card['4S'];
        var S5 = bridge.card['5S'];
        var S6 = bridge.card['6S'];
        var S7 = bridge.card['7S'];
        var S8 = bridge.card['8S'];
        var S9 = bridge.card['9S'];
        var ST = bridge.card['TS'];
        var SJ = bridge.card['JS'];
        var SQ = bridge.card['QS'];
        var SK = bridge.card['KS'];
        var SA = bridge.card['AS'];
        expect(S2.order).below(S3.order);
        expect(S3.order).below(S4.order);
        expect(S4.order).below(S5.order);
        expect(S5.order).below(S6.order);
        expect(S6.order).below(S7.order);
        expect(S7.order).below(S8.order);
        expect(S8.order).below(S9.order);
        expect(S9.order).below(ST.order);
        expect(ST.order).below(SJ.order);
        expect(SJ.order).below(SQ.order);
        expect(SQ.order).below(SK.order);
        expect(SK.order).below(SA.order);
    });

    it('2C is lowest', function() {
        var C2 = bridge.card['2C'];
        expect(C2.order).to.equal(1);
    });

    it('AS is highest', function() {
        var AS = bridge.card['AS'];
        expect(AS.order).to.equal(52);
    });

    it('has an SVG image', function() {
        expect(bridge.card.AS.imageUrl()).to.contain('.svg');
    });

});
