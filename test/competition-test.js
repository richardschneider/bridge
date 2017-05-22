'use strict';

var Competition = require('../').Competition;
var expect = require('chai').expect;

describe('Competition', function() {

    it('should have a name', function() {
        var contest = new Competition();
        expect(contest)
            .to.have.property('name')
            .that.is.a('string');
    });

});
