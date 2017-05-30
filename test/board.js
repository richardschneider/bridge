'use strict';

var Board = require('../').Board;
var Hand = require('../').Hand;
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
        expect(board.hands).has.property(seat.north).and.instanceOf(Hand);
        expect(board.hands).has.property(seat.south).and.instanceOf(Hand);
        expect(board.hands).has.property(seat.east).and.instanceOf(Hand);
        expect(board.hands).has.property(seat.west).and.instanceOf(Hand);
    });

    it('should calculate dealer from the board number', function() {
        var board = new Board();

        expect(board.setNumber(1).dealer).equal(seat.north);
        expect(board.setNumber(2).dealer).equal(seat.east);
        expect(board.setNumber(3).dealer).equal(seat.south);
        expect(board.setNumber(4).dealer).equal(seat.west);
        expect(board.setNumber(5).dealer).equal(seat.north);
        expect(board.setNumber(6).dealer).equal(seat.east);
        expect(board.setNumber(7).dealer).equal(seat.south);
        expect(board.setNumber(8).dealer).equal(seat.west);
    });

    it('should calculate vulnerability from the board number', function() {
        var board = new Board();

        expect(board.setNumber(1).vulnerability).equal('Nil');
        expect(board.setNumber(2).vulnerability).equal('NS');
        expect(board.setNumber(3).vulnerability).equal('EW');
        expect(board.setNumber(4).vulnerability).equal('All');
        expect(board.setNumber(5).vulnerability).equal('NS');
        expect(board.setNumber(6).vulnerability).equal('EW');
        expect(board.setNumber(7).vulnerability).equal('All');
        expect(board.setNumber(8).vulnerability).equal('Nil');
        expect(board.setNumber(9).vulnerability).equal('EW');
        expect(board.setNumber(10).vulnerability).equal('All');
        expect(board.setNumber(11).vulnerability).equal('Nil');
        expect(board.setNumber(12).vulnerability).equal('NS');
        expect(board.setNumber(13).vulnerability).equal('All');
        expect(board.setNumber(14).vulnerability).equal('Nil');
        expect(board.setNumber(15).vulnerability).equal('NS');
        expect(board.setNumber(16).vulnerability).equal('EW');
        expect(board.setNumber(17).vulnerability).equal('Nil');
    });
});
