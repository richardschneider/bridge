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

        it('should allow mulitple bids', function() {
            var auction = new Auction(seat.south);
            auction.bid(bid['1C'], '1S', '-', '-', '-');
            expect(auction.bids.length).equal(5);
            expect(auction.bids[0]).to.equal(bid['1C']);
            expect(auction.bids[1]).to.equal(bid['1S']);
            expect(auction.isClosed()).to.equal(true);
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

    describe ('Next seat to bid', function() {
        it('should be dealer with no bidding', function() {
            var auction = new Auction(seat.south);
            expect(auction.nextSeatToBid()).to.equal(seat.south);
        });

        it('should be null when auction is closed', function() {
            var auction = new Auction(seat.south);
            auction.bid('1C', '1S', '-', '-', '-');
            expect(auction.nextSeatToBid()).to.equal(null);
        });

        it('should follow the bidding from the dealer', function() {
            var auction = new Auction(seat.south);
            auction.bid('1C', '1S', '-', '-', 'X');
            expect(auction.nextSeatToBid()).to.equal(seat.west);
        });
    });

    describe('Contract', function() {
        it('should have level and denomination equal to the last bid', function() {
            var auction = new Auction(seat.south);
            auction.bid('1C', '1S', '-', '-', '-');
            var contract = auction.contract();
            expect(contract.level).to.equal(1);
            expect(contract.denomination).to.equal('S');
        });

        it('should have risk "X" when last bid is doubled', function() {
            var auction = new Auction(seat.south);
            auction.bid('1C');
            expect(auction.contract().risk).equal('');

            auction.bid('X');
            expect(auction.contract().risk).equal('X');

            auction.bid('-');
            expect(auction.contract().risk).equal('X');

            auction.bid('1S');
            expect(auction.contract().risk).equal('');
        });

        it('should have risk "XX" when last bid is redoubled', function() {
            var auction = new Auction(seat.south);
            auction.bid('1C', 'X');
            expect(auction.contract().risk).equal('X');

            auction.bid('XX');
            expect(auction.contract().risk).equal('XX');

            auction.bid('-');
            expect(auction.contract().risk).equal('XX');

            auction.bid('1S');
            expect(auction.contract().risk).equal('');
        });

        it('should have declaror equal to first partner to bid the denomination', function() {
            var auction = new Auction(seat.south);
            auction.bid('1C', '2C', '-', '5C');
            expect(auction.contract().declaror).equal(seat.west);
        });

    });

});
