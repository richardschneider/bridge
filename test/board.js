'use strict';

var Board = require('../').Board;
var seat = require('../').seat;
var expect = require('chai').expect;

describe('Board', function() {

    it('should have a dealer', function() {
        var board = new Board();
        board.dealer = seat.south;
        expect(board.dealer).to.equal(seat.south);
    });

    it('should have vulnerability Nil', function() {
        var board = new Board();
        board.dealer = seat.south;
        board.vulnerability = 'Nil';
        expect(board.isVulnerable(seat.north)).to.equal(false);
        expect(board.isVulnerable(seat.south)).to.equal(false);
        expect(board.isVulnerable(seat.east)).to.equal(false);
        expect(board.isVulnerable(seat.west)).to.equal(false);
    });

    it('should have vulnerability All', function() {
        var board = new Board();
        board.dealer = seat.south;
        board.vulnerability = 'All';
        expect(board.isVulnerable(seat.north)).to.equal(true);
        expect(board.isVulnerable(seat.south)).to.equal(true);
        expect(board.isVulnerable(seat.east)).to.equal(true);
        expect(board.isVulnerable(seat.west)).to.equal(true);
    });

    it('should have vulnerability NS', function() {
        var board = new Board();
        board.dealer = seat.south;
        board.vulnerability = 'NS';
        expect(board.isVulnerable(seat.north)).to.equal(true);
        expect(board.isVulnerable(seat.south)).to.equal(true);
        expect(board.isVulnerable(seat.east)).to.equal(false);
        expect(board.isVulnerable(seat.west)).to.equal(false);
    });

    it('should have vulnerability EW', function() {
        var board = new Board();
        board.dealer = seat.south;
        board.vulnerability = 'EW';
        expect(board.isVulnerable(seat.north)).to.equal(false);
        expect(board.isVulnerable(seat.south)).to.equal(false);
        expect(board.isVulnerable(seat.east)).to.equal(true);
        expect(board.isVulnerable(seat.west)).to.equal(true);
    });

    it('should have hand for each seat', function() {
        var board = new Board();

        expect(board).has.property('hands')
            .and.be.instanceof(Object);
        expect(board.hands).has.property(seat.north).and.instanceOf(Array);
        expect(board.hands).has.property(seat.south).and.instanceOf(Array);
        expect(board.hands).has.property(seat.east).and.instanceOf(Array);
        expect(board.hands).has.property(seat.west).and.instanceOf(Array);
    });
});
