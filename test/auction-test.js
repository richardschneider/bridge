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

    it('should be convertable to a string', function() {
        var auction = new Auction(seat.south);
        auction.bid(['-', 'Pass', '1NT', 'X', '-', '-', '-']);
        expect(auction.toString()).equal('- - 1NT X - - -');
    });

    it('should be convertable from a string', function() {
        var auction = new Auction(seat.south, '');
        expect(auction.bids.length).equal(0);

        auction = new Auction(seat.south, '  Pass -    1NT     X     -    -    -      ');
        expect(auction.bids.length).equal(7);
        expect(auction.toString()).equal('- - 1NT X - - -');
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

        it('should return the Bid object', function() {
            var auction = new Auction(seat.south);
            expect(auction.bid('1S')).to.equal(bid['1S']);
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

        it('should allow declarors partner to bid after a double', function() {
            var auction = new Auction(seat.south);
            auction.bid('1C', 'X', '1S');
            expect(auction.contract().toString()).equal('1S by N');
        });

        it('should allow declaror to bid after a double', function() {
            var auction = new Auction(seat.south);
            auction.bid('1C', 'X', '-', '-', '1S');
            expect(auction.contract().toString()).equal('1S by S');
        });

        it('should throw when doubling partner', function() {
            var auction = new Auction(seat.south);
            expect(function() { auction.bid(['1C', '-', 'X']); }).to.throw('Doubling your partner is not allowed');
        });

        it('should throw when opposition is already at risk', function() {
            var auction = new Auction(seat.south);
            expect(function() { auction.bid(['1C', 'X', '-', 'X']); }).to.throw('Opposition is already at risk');
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

    describe('Redoubling', function() {
        it('should allow partner to redouble a doubled contract', function() {
            var auction = new Auction(seat.south);
            auction.bid('1C', 'X', 'XX', '-', '-', '-');
            expect(auction.contract().toString()).equal('1CXX by S');
        });

        it('should allow declaror to redouble a doubled contract', function() {
            var auction = new Auction(seat.south);
            auction.bid('1C', 'X', '-', '-', 'XX');
            expect(auction.contract().toString()).equal('1CXX by S');

            auction = new Auction(seat.south);
            auction.bid('1C', '-', '-', 'X', 'XX');
            expect(auction.contract().toString()).equal('1CXX by S');
        });

        it('should throw on all other cases', function() {
            var auction = new Auction(seat.south);
            expect(function() { auction.bid(['XX']); }).to.throw('Invalid bid');

            auction = new Auction(seat.south);
            expect(function() { auction.bid(['1C', 'XX']); }).to.throw('Invalid bid');

            auction = new Auction(seat.south);
            expect(function() { auction.bid(['1C', '-', 'XX']); }).to.throw('Invalid bid');

            auction = new Auction(seat.south);
            expect(function() { auction.bid(['1C', '-', '-', 'XX']); }).to.throw('Invalid bid');

            auction = new Auction(seat.south);
            expect(function() { auction.bid(['1C', 'X', '-', 'XX']); }).to.throw('Invalid bid');

            auction = new Auction(seat.south);
            expect(function() { auction.bid(['1C', 'X', '1S', 'XX']); }).to.throw('Invalid bid');

            auction = new Auction(seat.south);
            expect(function() { auction.bid(['1C', 'X', '1S', '-', 'XX']); }).to.throw('Invalid bid');
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
