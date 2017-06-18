/*
 * session.js
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
 * A period of play during which those entered in a competition play designated
 * boards against designated opponents.
 */
function Session() {
    this.competition = new bridge.Competition();
    this.site = '';
    this.date = '';
    this.boards = [];
    this.games = [];
}

Session.generateBoards = function(boardCount) {
    var session = new Session();

    for (var i = 1; i <= boardCount; ++i)
    {
        var board = new bridge.Board();
        board.setNumber(i);
        board.hands = new bridge.Deck()
            .shuffle()
            .deal(board.dealer);

        session.boards.push(board);
    }

    return session;
};

Session.importPbn = function(stream, done) {

    // Return a promise to import if `done` is not defined.
    if (!done) {
        return new Promise(function(resolve, reject) {
            Session.importPbn(stream, function(err, session) {
                if (err) {
                    reject(err);
                } else {
                    resolve(session);
                }
            });
        });
    }

    var session = new Session(), game, board;
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
            session.games.push(game);
        }
        return game;
    }

    stream
        .pipe(pbn())
        .on('error', function(e) {
            done(e);
        })
        .on('end', function() {
            done(null, session);
        })
        .on('data', function(data) {
            if (data.type === 'game') {
                game = board = null;
            }
            else if (data.type === 'tag' && data.value !== '' && data.value !== '?') {
                if (data.name === 'Event') {
                    session.competition.name = data.value;
                } else if (data.name === 'Site') {
                    session.site = data.value;
                } else if (data.name === 'Date') {
                    session.date = data.value;
                } else if (data.name === 'Board') {
                    var number = parseInt(data.value, 10);
                    board = session.boards.find(function(b) { return b.number === number; });
                    if (!board) {
                        board = new bridge.Board();
                        board.setNumber(number);
                        session.boards.push(board);
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
                    board.deal(data.value);
                } else if (data.name === 'Scoring') {
                    // TODO: Scoring
                } else if (data.name === 'Declarer') {
                    needGame().contract.declaror = bridge.seat[data.value];
                } else if (data.name === 'Contract') {
                    needGame();
                    if (data.value !== 'Pass') {
                        game.contract.level = parseInt(data.value.substring(0, 1), 10);
                        game.contract.denomination = data.value.substring(1, 2);
                        game.contract.risk = data.value.slice(2);
                    }
                } else if (data.name === 'Result') {
                    var result = parseInt(data.value, 10);
                    var contract = needGame().contract;
                    var made = (result >= contract.level + 6) ? (result - 6) : (result - (contract.level + 6));
                    game.made = made;
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

    //return session;
};

module.exports = Session;
