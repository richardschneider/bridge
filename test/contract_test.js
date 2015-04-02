'use strict';

var bridge = require('../');
var expect = require('chai').expect;

describe('Contract', function() {

    it('should default to passed in', function() {
        var contract = new bridge.Contract();
        expect(contract.toString()).to.equal('-');
        expect(contract.level).to.equal(0);
    });

    it('should have the level, denomination, risk and declaror', function() {
        var contract = new bridge.Contract();
        contract.level = 3;
        contract.denomination = 'NT';
        contract.declaror = 'S';
        contract.risk = 'X';
        expect(contract.toString()).to.equal('3NTX by S');
    });

});
