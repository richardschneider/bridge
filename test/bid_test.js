'use strict';

var bridge = require('../');
var expect = require('chai').expect;

describe('Bid', function() {
    it('has level and denonimation', function() {
        var bid = bridge.bid['1NT'];
        expect(bid.level).to.equal(1);
        expect(bid.denomination).to.equal('NT');

        bid = bridge.bid['7S'];
        expect(bid.level).to.equal(7);
        expect(bid.denomination).to.equal('S');
    });

    it('can be pass', function() {
        var bid = bridge.bid['-'];
        expect(bid.isPass).equal(true);
    });

    it('can be double', function() {
        var bid = bridge.bid['X'];
        expect(bid.isDouble).equal(true);
    });

    it('can be redouble', function() {
        var bid = bridge.bid['XX'];
        expect(bid.isRedouble).equal(true);
    });

    it('has suit color', function() {
        expect(bridge.bid['1C'].isRed).equal(false);
        expect(bridge.bid['1D'].isRed).equal(true);
        expect(bridge.bid['1H'].isRed).equal(true);
        expect(bridge.bid['1S'].isRed).equal(false);
    });

    it('is ordered by denomination within level', function() {
        var club = bridge.bid['1C'];
        var diamond = bridge.bid['1D'];
        var heart = bridge.bid['1H'];
        var spade = bridge.bid['1S'];
        var notrump = bridge.bid['1NT'];
        expect(club.order).below(diamond.order);
        expect(diamond.order).below(heart.order);
        expect(heart.order).below(spade.order);
        expect(spade.order).below(notrump.order);
    });

    it('is ordered by level', function() {
        expect(bridge.bid['1C'].order).below(bridge.bid['2C'].order);
        expect(bridge.bid['2C'].order).below(bridge.bid['3C'].order);
        expect(bridge.bid['3C'].order).below(bridge.bid['4C'].order);
        expect(bridge.bid['4C'].order).below(bridge.bid['5C'].order);
        expect(bridge.bid['5C'].order).below(bridge.bid['6C'].order);
        expect(bridge.bid['6C'].order).below(bridge.bid['7C'].order);
    });

    it('1C is lowest', function() {
        expect(bridge.bid['1C'].order).to.equal(1);
    });

    it('7NT is highest', function() {
        expect(bridge.bid['7NT'].order).to.equal(35);
    });

    it('string representation is the bid', function() {
        expect(bridge.bid['3D'].toString()).to.equal('3D');
        expect(bridge.bid.pass.toString()).to.equal('-');
        expect(bridge.bid.double.toString()).to.equal('X');
        expect(bridge.bid.redouble.toString()).to.equal('XX');
    });


});
