/*
 * event.js
 * https://github.com/richardschneider/bridge
 *
 * Copyright (c) 2016 Richard Schneider
 * Licensed under the MIT license.
 */

'use strict';

var bridge = require('./bridge');
var pbn = require('pbn');
var Readable = require('stream').Readable;

/*
 * An organised bridge competition
 */
function Event() {
    this.name = '';
    this.site = '';
    this.date = '';
    this.boards = [];
    this.games = [];
}

Event.importPbn = function(stream, done) {
    var event = new Event(), game, board;
    var vulnerabilities = {
        None: 'Nil', Love: 'Nil', '-': 'Nil',
        All: 'All', Both: 'All',
        NS: 'NS', EW: 'EW'
    };

    if (typeof stream === 'string') {
        var text = stream;
        stream = new Readable();
        stream.push(text);
        stream.push(null);
    }

    function needGame() {
        if (!game) {
            game = new bridge.Game();
            game.board = board;
            game.auction.dealer = board.dealer;
            event.games.push(game);
        }
        return game;
    }

    stream
        .pipe(pbn())
        .on('error', function(e) {
            done(e);
        })
        .on('end', function() {
            done(null, event);
        })
        .on('data', function(data) {
            if (data.type === 'game') {
                game = board = null;
            }
            else if (data.type === 'tag' && data.value !== '' && data.value !== '?') {
                if (data.name === 'Event') {
                    event.name = data.value;
                } else if (data.name === 'Site') {
                    event.site = data.value;
                } else if (data.name === 'Date') {
                    event.date = data.value;
                } else if (data.name === 'Board') {
                    var number = parseInt(data.value, 10);
                    board = event.boards.find(function(b) { return b.number === number; });
                    if (!board) {
                        board = new bridge.Board();
                        board.setNumber(number);
                        event.boards.push(board);
                    }
                    if (game) {
                        game.board = board;
                    }
                } else if (data.name === 'West') {
                    needGame().players[bridge.seat.west] = data.value;
                } else if (data.name === 'North') {
                    needGame().players[bridge.seat.north] = data.value;
                } else if (data.name === 'East') {
                    needGame().players[bridge.seat.east] = data.value;
                } else if (data.name === 'South') {
                    needGame().players[bridge.seat.south] = data.value;
                } else if (data.name === 'Dealer') {
                    board.dealer = bridge.seat[data.value];
                    if (game) {
                        game.auction.dealer = board.dealer;
                    }
                } else if (data.name === 'Vulnerable') {
                    board.vulnerability = vulnerabilities[data.value];
                } else if (data.name === 'Deal') {
                    data.cards.forEach(function (c) {
                        board.hands[bridge.seat[c.seat]].cards.push(bridge.card[c.suit + c.rank]);
                    });
                } else if (data.name === 'Scoring') {
                    // TODO: Scoring
                } else if (data.name === 'Declarer') {
                    needGame().contract.declaror = bridge.seat[data.value];
                } else if (data.name === 'Contract') {
                    needGame();
                    if (data.value !== 'Pass') {
                        game.contract.level = data.value.substring(0, 1);
                        game.contract.denomination = data.value.substring(1, 2);
                        game.contract.risk = data.value.slice(2);
                    }
                } else if (data.name === 'Result') {
                    // TODO: Result
                } else if (data.name === 'Auction') {
                    var auction = needGame().auction;
                    data.tokens.forEach(function(bid) {
                        if (bid === 'AP') {
                            while (!auction.isClosed()) {
                                auction.bid('Pass');
                            }
                        }
                        else if (bid === '-' || bid === '*') {
                            // ignore noise
                        }
                        else if (bid.startsWith('=')) {
                            // ignore notes
                        }
                        else {
                            auction.bid(bid);
                        }
                    });
                } else if (data.name === 'Play') {
                    var tricks = needGame().tricks;
                    var trick = new bridge.Trick();
                    tricks.push(trick);
                    var seat = bridge.seat[data.value];
                    var leader = seat;
                    data.tokens.forEach(function(card) {
                        if (card === '-' || card === '*') {
                            seat = seat.next;
                        }
                        else if (card.startsWith('=')) {
                            // ignore notes
                        }
                        else {
                            if (trick.play.length === 4) {
                                leader = trick.winner(game.contract);
                                trick = new bridge.Trick();
                                tricks.push(trick);
                            }
                            trick.play.push({ seat: seat, card: bridge.card[card]});
                            trick.play.sort(function(a, b) { return bridge.seat.distance(leader, a.seat) - bridge.seat.distance(leader, b.seat); });
                            seat = seat.next;
                        }
                    });

                }
            }
        });
};

module.exports = Event;
