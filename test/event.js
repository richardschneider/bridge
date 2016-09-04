'use strict';

var Event = require('../').Event;
var seat = require('../').seat;
var expect = require('chai').expect;
var fs = require('fs');

describe('Event', function() {

    it('should have a name', function() {
        var event = new Event();
        expect(event).to.have.property('name')
            .that.is.a('string');
    });

    it('should have a site', function() {
        var event = new Event();
        expect(event).to.have.property('site')
            .that.is.a('string');
    });

    it('should have a date', function() {
        var event = new Event();
        expect(event).to.have.property('date')
            .that.is.a('string');
    });

    it('should have boards', function() {
        var event = new Event();
        expect(event).to.have.property('boards')
            .that.is.instanceof(Array);
    });

    it('should have games', function() {
        var event = new Event();
        expect(event).to.have.property('games')
            .that.is.instanceof(Array);
    });

    describe('import PBN', function() {
        it('should return a new Event', function(done) {
            var stream = fs.createReadStream('./test/sample/Schiphol.pbn');
            Event.importPbn(stream, function(err, event) {
                expect(event).is.instanceof(Event);
                done();
            });
        });

        it('should return an Error', function(done) {
            Event.importPbn('[Event test]', function(err) { // test should be in quotes
                expect(err).is.instanceof(Error);
                done();
            });
        });

        it('should process mandatory tags', function(done) {
            var stream = fs.createReadStream('./test/sample/Schiphol.pbn');
            Event.importPbn(stream, function(err, event) {
                expect(event).to.have.property('name', 'International Amsterdam Airport Schiphol Bridgetournament');
                expect(event).to.have.property('site', 'Amsterdam, The Netherlands NLD');
                expect(event).to.have.property('date', '1995.06.10');
                expect(event).to.have.property('boards').of.length(1);
                expect(event).to.have.property('games').of.length(1);
                // TODO: North, East, South, West
                expect(event.boards[0]).to.have.property('dealer', seat.north);
                expect(event.boards[0]).to.have.property('vulnerability', 'Nil');
                expect(event.games[0].auction).to.have.property('dealer', seat.north);
                expect(event.games[0].players).to.have.property(seat.north, 'Westra');
                expect(event.games[0].players).to.have.property(seat.south, 'Leufkens');
                expect(event.games[0].players).to.have.property(seat.east, 'Kalish');
                expect(event.games[0].players).to.have.property(seat.west, 'Podgor');
                // TODO: Deal
                // TODO: Scoring
                expect(event.games[0].contract.toString()).to.equal('5HX by S');
                // TODO: Result
                done();
            });
        });

        it('should process board records only', function(done) {
            var stream = fs.createReadStream('./test/sample/Hand_Trophy_Pairs.pbn');
            Event.importPbn(stream, function(err, event) {
                expect(event).to.have.property('name', '160816TuE');
                expect(event).to.have.property('site', '');
                expect(event).to.have.property('date', '2016.08.16');
                expect(event).to.have.property('boards').of.length(26);
                expect(event).to.have.property('games').of.length(0);
                expect(event.boards[23-1]).to.have.property('dealer', seat.south);
                expect(event.boards[23-1]).to.have.property('vulnerability', 'All');
                // TODO: Deal
                // TODO: Scoring
                done();
            });
        });

    });

});
