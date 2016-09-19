/*
 * trick.js
 * https://github.com/richardschneider/bridgejs
 *
 * Copyright (c) 2015 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

/**
 * The unit by which the outcome of the contract is determined, regularly
 * consisting of four cards, one contributed by each player in rotation, beginning with the
 * lead.
 **/
function Trick() {
    this.play = [];  // each object has a card and seat property.
}

/** The 1st seat to play a card */
Trick.prototype.leader = function() {
    return this.play.length < 1 ? undefined : this.play[0].seat;
};

/** The suit of the 1st played card */
Trick.prototype.leaderSuit = function() {
    return this.play.length < 1 ? undefined : this.play[0].card.suit;
};

/** The seat that has won the trick */
Trick.prototype.winner = function(contract) {
    if (this.play.length < 4) {
        return undefined;
    }

    var play, bestSeat, bestOrder = -10000, order;
    var lead = this.leaderSuit();
    for (var i = 0; i < 4; ++i)
    {
        play = this.play[i];
        order = play.card.order;
        if (play.card.suit === contract.denomination) {
            order *= 1000;
        }
        else if (play.card.suit !== lead) {
            continue;
        }

        if (order > bestOrder) {
            bestOrder = order;
            bestSeat = play.seat;
        }
    }

    return bestSeat;
};

module.exports = Trick;
