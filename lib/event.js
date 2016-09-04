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
            else if (data.type === 'tag' && data.value !== '') {
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
                        board.number = number;
                        event.boards.push(board);
                    }
                    if (game) {
                        game.board = board;
                    }
                } else if (data.name === 'West') {

                } else if (data.name === 'North') {

                } else if (data.name === 'East') {

                } else if (data.name === 'South') {

                } else if (data.name === 'Dealer') {
                    board.dealer = bridge.seat[data.value];
                    if (game) {
                        game.auction.dealer = board.dealer;
                    }
                } else if (data.name === 'Vulnerable') {
                    board.vulnerability = vulnerabilities[data.value];
                } else if (data.name === 'Deal') {

                } else if (data.name === 'Scoring') {

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

                }
            }
        });
};

module.exports = Event;
