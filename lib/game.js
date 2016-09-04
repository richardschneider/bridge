/*
 * game.js
 * https://github.com/richardschneider/bridge
 *
 * Copyright (c) 2016 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

var Auction = require('./auction');
var Contract = require('./contract');

/*
 * An organised bridge competition
 */
function Game() {
    this.auction = new Auction();
    this.contract = new Contract();
    this.play = [];
}

module.exports = Game;
