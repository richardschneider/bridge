'use strict';

var Auction = require('../').Auction;
var seat = require('../').seat;
var bid = require('../').bid;
var expect = require('chai').expect;

describe('Auction', function() {

    it('should have a dealer', function() {
        expect(new Auction(seat.north).dealer).to.equal(seat.north);
    });

    it('should have the bidding history', function() {
         expect(new Auction(seat.north).bids).to.be.a('array');
    });

    it('should be closed with 3 passes after a bid', function() {
        var auction = new Auction(seat.south);
        expect(auction.isClosed()).equal(false);

        auction.bid(['-', '-', '-']);
        expect(auction.isClosed()).equal(false);

        auction.bid('-');
        expect(auction.isClosed()).equal(true);

        auction = new Auction(seat.south);
        auction.bid(['1S', '-', '-', '-']);
        expect(auction.isClosed()).equal(true);
    });

    describe('Bidding', function() {
        it('should allow adding a Bid object or a string', function() {
            var auction = new Auction(seat.south);
            auction.bid(bid['1S']);
            auction.bid('2C');
            expect(auction.bids.length).equal(2);
            expect(auction.bids[0]).to.equal(bid['1S']);
            expect(auction.bids[1]).to.equal(bid['2C']);
        });

        it('should allow adding an array of Bid object or a string', function() {
            var auction = new Auction(seat.south);
            auction.bid([bid['1S'], '2C']);
            expect(auction.bids.length).equal(2);
            expect(auction.bids[0]).to.equal(bid['1S']);
            expect(auction.bids[1]).to.equal(bid['2C']);
        });

        it('should throw when not a bid', function() {
            var auction = new Auction(seat.south);
            expect(function() { auction.bid(1); }).to.throw('Invalid bid');
        });

        it('should allow a pass', function() {
            var auction = new Auction(seat.south);
            auction.bid(bid.pass);
            expect(auction.bids.length).equal(1);
        });

        it('should throw on insufficient bid', function() {
            var auction = new Auction(seat.south);
            auction.bid('1S');
            auction.bid('2C');
            expect(function() { auction.bid('1D'); }).to.throw('Insufficient bid');
            expect(auction.bids.length).equal(2);
        });

        it('should throw when auction is closed', function() {
            var auction = new Auction(seat.south);
            auction.bid(['1S', '-', '-', '-']);
            expect(function() { auction.bid('4S'); }).to.throw('Bidding not allowed, auction is closed');
        });

    });

    describe('Doubling', function() {
        it('should allow a rho double', function() {
            var auction = new Auction(seat.south);
            auction.bid(['1C', 'X']);
            expect(auction.bids.length).equal(2);
        });

        it('should allow a lho double', function() {
            var auction = new Auction(seat.south);
            auction.bid(['1C', '-', '-', 'X']);
            expect(auction.bids.length).equal(4);
        });

        it('should throw when doubling partner', function() {
            var auction = new Auction(seat.south);
            expect(function() { auction.bid(['1C', '-', 'X']); }).to.throw('Doubling your partner is not allowed');
        });

        it('should throw when opposition has no contract', function() {
            var auction = new Auction(seat.south);
            expect(function() { auction.bid(['X']); }).to.throw('Cannot double when opposition has no contract');

            auction = new Auction(seat.south);
            expect(function() { auction.bid(['-', 'X']); }).to.throw('Cannot double when opposition has no contract');

            auction = new Auction(seat.south);
            expect(function() { auction.bid(['-', '-', '-', 'X']); }).to.throw('Cannot double when opposition has no contract');
        });

    });

});
