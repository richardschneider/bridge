'use strict';

var bridge = require('..');
var Game = bridge.Game;
var expect = require('chai').expect;

describe('Game', function() {

    it('should have an auction', function() {
        var game = new Game();
        expect(game).to.have.property('auction');
    });

    it('should have a contract', function() {
        var game = new Game();
        expect(game).to.have.property('contract');
    });

    it('should have played tricks', function() {
        var game = new Game();
        expect(game).to.have.property('tricks');
    });

    it('should have a lead', function() {
            var game = new Game();
            game.contract.level = 3;
            game.contract.denomination = 'NT';
            game.contract.declaror = bridge.seat.south;
            game.play('AS');
            game.play('2S');
            expect(game.lead()).to.equal(bridge.card.SA);
    });

    describe('play', function() {
        it('should allow an opening lead', function() {
            var game = new Game();
            game.contract.level = 3;
            game.contract.denomination = 'NT';
            game.contract.declaror = bridge.seat.south;
            game.play('AS');
            expect(game.tricks).to.have.length(1);
            expect(game.tricks[0].leader()).to.equal(bridge.seat.west);
        });

        it('should return next seat to play', function() {
            var game = new Game();
            game.contract.level = 3;
            game.contract.denomination = 'NT';
            game.contract.declaror = bridge.seat.south;
            var next = game.play('AS', '2S');
            expect(next).to.equal(bridge.seat.east);
        });

        it('should return next seat as winner of a trick', function() {
            var game = new Game();
            game.contract.level = 3;
            game.contract.denomination = 'NT';
            game.contract.declaror = bridge.seat.south;
            var next = game.play('2S', 'AS', '3S', '4S');
            expect(next).to.equal(bridge.seat.north);
        });

        it('should create new tricks', function() {
            var game = new Game();
            game.contract.level = 3;
            game.contract.denomination = 'NT';
            game.contract.declaror = bridge.seat.south;
            var next = game.play('2S', 'AS', '3S', '4S', 'KS', '5S');
            expect(game.tricks).to.have.length(2);
            expect(game.tricks[1].play[0].card).to.equal(bridge.card.SK);
            expect(game.tricks[1].play[0].seat).to.equal(bridge.seat.north);
            expect(game.tricks[1].play[1].card).to.equal(bridge.card.S5);
            expect(game.tricks[1].play[1].seat).to.equal(bridge.seat.east);
            expect(game.tricks[1].leader()).to.equal(bridge.seat.north);
        });

        it('should allow string or Card', function() {
            var game = new Game();
            game.contract.level = 3;
            game.contract.denomination = 'NT';
            game.contract.declaror = bridge.seat.south;
            game.play('AS', bridge.card.S2);
            expect(game.tricks[0].play[0].card).to.equal(bridge.card.SA);
            expect(game.tricks[0].play[1].card).to.equal(bridge.card.S2);
        });

        it('should return an array of cards', function() {
            var game = new Game();
            game.contract.level = 3;
            game.contract.denomination = 'NT';
            game.contract.declaror = bridge.seat.south;
            game.play('AS', bridge.card.S2);
            var play = game.play();
            expect(play).to.have.length(2).and.eql([bridge.card.SA, bridge.card.S2]);
        });

    });

});
