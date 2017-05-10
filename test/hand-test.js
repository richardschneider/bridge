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
        expect(hand.toString()).to.equal('AS AH AD AC');
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

    it('produce PBN', function() {
      var hand = new bridge.Hand();
      hand.cards.push(card.C5);
      hand.cards.push(card.C8);
      hand.cards.push(card.D2);
      hand.cards.push(card.D4);
      hand.cards.push(card.D5);
      hand.cards.push(card.D6);
      hand.cards.push(card.DJ);
      hand.cards.push(card.HT);
      hand.cards.push(card.HA);
      hand.cards.push(card.S2);
      hand.cards.push(card.ST);
      hand.cards.push(card.SQ);
      hand.cards.push(card.SK);

      var pbn = hand.toPBN();
      expect(pbn).to.equal('KQT2.AT.J6542.85');
    });

    it('produce PBN with missing leading suit', function() {
      var hand = new bridge.Hand();
      hand.cards.push(card.C5);
      hand.cards.push(card.C8);
      hand.cards.push(card.D2);
      hand.cards.push(card.D4);
      hand.cards.push(card.D5);
      hand.cards.push(card.D6);
      hand.cards.push(card.DJ);
      hand.cards.push(card.HT);
      hand.cards.push(card.HA);
      hand.cards.push(card.C2);
      hand.cards.push(card.CT);
      hand.cards.push(card.CQ);
      hand.cards.push(card.CK);

      var pbn = hand.toPBN();
      expect(pbn).to.equal('.AT.J6542.KQT852');
    });

    it('produce PBN with missing internal suit', function() {
      var hand = new bridge.Hand();
      hand.cards.push(card.C5);
      hand.cards.push(card.C8);
      hand.cards.push(card.D2);
      hand.cards.push(card.D4);
      hand.cards.push(card.D5);
      hand.cards.push(card.D6);
      hand.cards.push(card.DJ);
      hand.cards.push(card.CT);
      hand.cards.push(card.CA);
      hand.cards.push(card.S2);
      hand.cards.push(card.ST);
      hand.cards.push(card.SQ);
      hand.cards.push(card.SK);

      var pbn = hand.toPBN();
      expect(pbn).to.equal('KQT2..J6542.AT85');
    });

    it('produce PBN with missing trailing suits', function() {
      var hand = new bridge.Hand();
      hand.cards.push(card.S5);
      hand.cards.push(card.S8);
      hand.cards.push(card.H2);
      hand.cards.push(card.H4);
      hand.cards.push(card.H5);
      hand.cards.push(card.H6);
      hand.cards.push(card.HJ);
      hand.cards.push(card.HT);
      hand.cards.push(card.HA);
      hand.cards.push(card.S2);
      hand.cards.push(card.ST);
      hand.cards.push(card.SQ);
      hand.cards.push(card.SK);

      var pbn = hand.toPBN();
      expect(pbn).to.equal('KQT852.AJT6542..');
    });

    it('produce PBN with only one suit', function() {
      var hand = new bridge.Hand();
      hand.cards.push(card.H2);
      hand.cards.push(card.H3);
      hand.cards.push(card.H4);
      hand.cards.push(card.H5);
      hand.cards.push(card.H6);
      hand.cards.push(card.H7);
      hand.cards.push(card.H8);
      hand.cards.push(card.H9);
      hand.cards.push(card.HT);
      hand.cards.push(card.HJ);
      hand.cards.push(card.HQ);
      hand.cards.push(card.HK);
      hand.cards.push(card.HA);

      var pbn = hand.toPBN();
      expect(pbn).to.equal('.AKQJT98765432..');
    });
});
