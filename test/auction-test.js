'use strict';

var Auction = require('../').Auction;
var seat = require('../').seat;
var expect = require('chai').expect;

describe('Auction', function() {

    it('should have a dealer', function() {
        expect(new Auction(seat.north).dealer).to.equal(seat.north);
    });

    it('should have the bidding history', function() {
         expect(new Auction(seat.north).bids).to.be.a('array');
    });

});
