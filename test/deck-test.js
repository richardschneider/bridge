'use strict';

var bridge = require('../');
var expect = require('chai').expect;

describe('Deck', function() {

    it('has 52 cards', function() {
        var deck = new bridge.Deck();
        expect(deck.cards.length).to.equal(52);
    });

    it('ordered from lowest to highest', function() {
        var deck = new bridge.Deck();
        expect(deck.cards[0]).to.equal(bridge.card.C2);
        expect(deck.cards[51]).to.equal(bridge.card.SA);
    });

    it('can be shuffled but NOT tested', function() {
        var deck = new bridge.Deck().shuffle();
        expect(deck.cards.length).to.equal(52);
        for (var i = 0; i < 52; ++i)
        {
            expect(deck.cards[i]).to.exist;
        }
    });

});
