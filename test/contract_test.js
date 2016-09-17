'use strict';

var bridge = require('../');
var expect = require('chai').expect;

describe('Contract', function() {

    it('should default to passed in', function() {
        var contract = new bridge.Contract();
        expect(contract.toString()).to.equal('-');
        expect(contract.level).to.equal(0);
        expect(contract.isPassedIn()).to.equal(true);
    });

    it('should have the level, denomination, risk and declaror', function() {
        var contract = new bridge.Contract();
        contract.level = 3;
        contract.denomination = 'NT';
        contract.declaror = bridge.seat.south;
        contract.risk = 'X';
        expect(contract.toString()).to.equal('3NTX by S');
        expect(contract.isPassedIn()).to.equal(false);
    });

    it('should have a dummy', function() {
        var contract = new bridge.Contract();
        contract.level = 3;
        contract.denomination = 'NT';
        contract.declaror = bridge.seat.south;
        contract.risk = 'X';
        expect(contract.dummy()).to.equal(bridge.seat.north);
    });

    it('should have a undefined dummy', function() {
        var contract = new bridge.Contract();
        expect(contract.dummy()).to.equal(undefined);
    });

    it('should have a leader', function() {
        var contract = new bridge.Contract();
        contract.level = 3;
        contract.denomination = 'NT';
        contract.declaror = bridge.seat.south;
        contract.risk = 'X';
        expect(contract.leader()).to.equal(bridge.seat.west);
    });

    it('should have opponents', function() {
        var contract = new bridge.Contract();
        contract.level = 3;
        contract.denomination = 'NT';
        contract.declaror = bridge.seat.south;
        contract.risk = 'X';
        expect(contract.isOpponent(bridge.seat.north)).to.equal(false);
        expect(contract.isOpponent(bridge.seat.south)).to.equal(false);
        expect(contract.isOpponent(bridge.seat.east)).to.equal(true);
        expect(contract.isOpponent(bridge.seat.west)).to.equal(true);
    });

});
