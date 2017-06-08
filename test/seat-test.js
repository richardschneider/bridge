'use strict';

var seat = require('../').seat;
var expect = require('chai').expect;

describe('Seat', function() {

    it('has 4 seats N, S, E and W', function() {
        expect(seat.north).to.exist;
        expect(seat.south).to.exist;
        expect(seat.east).to.exist;
        expect(seat.west).to.exist;

        expect(seat.north.symbol).to.equal('N');
        expect(seat.south.symbol).to.equal('S');
        expect(seat.east.symbol).to.equal('E');
        expect(seat.west.symbol).to.equal('W');

        expect(seat.north).to.equal(seat.N);
        expect(seat.south).to.equal(seat.S);
        expect(seat.east).to.equal(seat.E);
        expect(seat.west).to.equal(seat.W);
    });

    it('partner is directly opposite', function() {
       expect(seat.north.partner).to.equal(seat.south);
       expect(seat.south.partner).to.equal(seat.north);
       expect(seat.east.partner).to.equal(seat.west);
       expect(seat.west.partner).to.equal(seat.east);
    });

    it('has right hand opponent', function() {
       expect(seat.north.rho).to.equal(seat.west);
       expect(seat.south.rho).to.equal(seat.east);
       expect(seat.east.rho).to.equal(seat.north);
       expect(seat.west.rho).to.equal(seat.south);
    });

    it('has left hand opponent', function() {
       expect(seat.north.lho).to.equal(seat.east);
       expect(seat.south.lho).to.equal(seat.west);
       expect(seat.east.lho).to.equal(seat.south);
       expect(seat.west.lho).to.equal(seat.north);
    });

    it('string representation is the name', function() {
       expect(seat.north.toString()).to.equal('north');
    });

    it('has a symbol', function() {
       expect(seat.north.symbol).to.equal('N');
       expect(seat.south.symbol).to.equal('S');
       expect(seat.east.symbol).to.equal('E');
       expect(seat.west.symbol).to.equal('W');
    });

    it('should measure the clockwise distance between seats', function() {
        var a = seat.west;
        expect(seat.distance(a, seat.west)).to.equal(0);
        expect(seat.distance(a, seat.north)).to.equal(1);
        expect(seat.distance(a, seat.east)).to.equal(2);
        expect(seat.distance(a, seat.south)).to.equal(3);
    });

});
