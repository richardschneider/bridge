'use strict';

var bridge = require('../');
var seat = bridge.seat;
var expect = require('chai').expect;

describe('Trick', function() {

    it('leader is 1st to play a card', function() {
        var trick = new bridge.Trick();
        expect(trick.leader()).to.be.undefined();
        trick.play.push({ seat: seat.west} );
        expect(trick.leader()).to.equal(seat.west);
        trick.play.push({ seat: seat.east} );
        expect(trick.leader()).to.equal(seat.west);
    });

    it('leader suit is the suit 1st card played', function() {
        var trick = new bridge.Trick();
        expect(trick.leaderSuit()).to.be.undefined();

        trick.play.push({ seat: seat.north, card: bridge.card.S2 } );
        expect(trick.leaderSuit()).to.equal('S');
    });

    it('winner is declared after 4 cards are played', function() {
        var contract = new bridge.Contract();
        contract.denomination = 'NT';
        var trick = new bridge.Trick();
        expect(trick.winner()).to.be.undefined();
        trick.play.push({ seat: seat.north, card: bridge.card.S2 } );
        trick.play.push({ seat: seat.east, card: bridge.card.SK } );
        trick.play.push({ seat: seat.south, card: bridge.card.HA } );
        trick.play.push({ seat: seat.west, card: bridge.card.S3 } );
        expect(trick.winner(contract)).to.exist();
    });

    it('winner has the highest rank of the 1st suit played', function() {
        var contract = new bridge.Contract();
        contract.denomination = 'NT';
        var trick = new bridge.Trick();
        expect(trick.winner()).to.be.undefined();

        trick.play.push({ seat: seat.north, card: bridge.card.H3 } );
        trick.play.push({ seat: seat.east, card: bridge.card.HK } );
        trick.play.push({ seat: seat.south, card: bridge.card.SA } );
        trick.play.push({ seat: seat.west, card: bridge.card.H2 } );
        expect(trick.winner(contract)).to.equal(seat.east);
    });

    it('winner has the highest trump', function() {
        var contract = new bridge.Contract();
        contract.denomination = 'H';
        var trick = new bridge.Trick();
        expect(trick.winner()).to.be.undefined();
        trick.play.push({ seat: seat.north, card: bridge.card.SA } );
        trick.play.push({ seat: seat.east, card: bridge.card.HQ } );
        trick.play.push({ seat: seat.south, card: bridge.card.HK } );
        trick.play.push({ seat: seat.west, card: bridge.card.S2 } );
        expect(trick.winner(contract)).to.equal(seat.south);
    });

});
