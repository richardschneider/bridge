'use strict';

var bridge = require('../');
var card = bridge.card;
var expect = require('chai').expect;

describe('Hand', function() {

    it('sorts by descending order', function() {
        var hand = new bridge.Hand();
        hand.cards.push(card.CA);
        hand.cards.push(card.DA);
        hand.cards.push(card.HA);
        hand.cards.push(card.SA);
        hand.sort();
        expect(hand.cards[0]).to.equal(card.SA);
        expect(hand.cards[1]).to.equal(card.HA);
        expect(hand.cards[2]).to.equal(card.DA);
        expect(hand.cards[3]).to.equal(card.CA);
    });

    it('string representation is the cards', function() {
        var hand = new bridge.Hand();
        hand.cards.push(card.CA);
        hand.cards.push(card.DA);
        hand.cards.push(card.HA);
        hand.cards.push(card.SA);
        hand.sort();
        expect(hand + '').to.equal('AS AH AD AC');
    });

    it('cards can be filter by suit', function () {
        var hand = new bridge.Hand();
        hand.cards.push(card.CA);
        hand.cards.push(card.SK);
        hand.cards.push(card.DA);
        hand.cards.push(card.HA);
        hand.cards.push(card.SA);
        var spades = hand.sort().cardsWithSuit('S');
        expect(spades[0]).to.equal(card.SA);
        expect(spades[1]).to.equal(card.SK);
    });
});
