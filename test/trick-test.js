'use strict';

var bridge = require('../');
var expect = require('chai').expect;

describe('Trick', function() {

    it('leader is 1st to play a card', function() {
        var trick = new bridge.Trick();
        expect(trick.leader()).to.be.undefined;
        trick.play.push({ seat: 'W'} );
        expect(trick.leader()).to.equal('W');
        trick.play.push({ seat: 'E'} );
        expect(trick.leader()).to.equal('W');
    });

    it('winner is declared after 4 cards are played', function() {
        var contract = new bridge.Contract();
        contract.denomination = 'NT';
        var trick = new bridge.Trick();
        expect(trick.winner()).to.be.undefined;
        trick.play.push({ seat: 'N', card: bridge.card.S2 } );
        trick.play.push({ seat: 'E', card: bridge.card.SK } );
        trick.play.push({ seat: 'S', card: bridge.card.HA } );
        trick.play.push({ seat: 'W', card: bridge.card.S3 } );
        expect(trick.winner(contract)).to.exist;
    });

    it('winner has the highest rank of the 1st suit played', function() {
        var contract = new bridge.Contract();
        contract.denomination = 'NT';
        var trick = new bridge.Trick();
        expect(trick.winner()).to.be.undefined;

        trick.play.push({ seat: 'N', card: bridge.card.S3 } );
        trick.play.push({ seat: 'E', card: bridge.card.SK } );
        trick.play.push({ seat: 'S', card: bridge.card.HA } );
        trick.play.push({ seat: 'W', card: bridge.card.S2 } );
        expect(trick.winner(contract)).to.equal('E');
    });

    it('winner has the highest trump', function() {
        var contract = new bridge.Contract();
        contract.denomination = 'H';
        var trick = new bridge.Trick();
        expect(trick.winner()).to.be.undefined;
        trick.play.push({ seat: 'N', card: bridge.card.SA } );
        trick.play.push({ seat: 'E', card: bridge.card.HQ } );
        trick.play.push({ seat: 'S', card: bridge.card.HK } );
        trick.play.push({ seat: 'W', card: bridge.card.S2 } );
        expect(trick.winner(contract)).to.equal('S');
    });

});
