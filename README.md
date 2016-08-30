# bridge
[![Travis build status](https://travis-ci.org/richardschneider/bridge.svg)](https://travis-ci.org/richardschneider/bridge)
[![Coverage Status](https://coveralls.io/repos/github/richardschneider/bridge/badge.svg?branch=master)](https://coveralls.io/github/richardschneider/bridge?branch=master)

A javascript model for contract (duplicate) bridge.

The release history and change notes are on [github](https://github.com/richardschneider/bridge/releases).

## Getting started

Install it for your project

    bower install bridge.js --save
    
Include it your HTML page

    <script src="./bower-modules/bridge.js/dist/bridge.min.js"></script>
    
Use it

    <script>
      var hands = new bridge.Deck().shuffle().deal(bridge.seat.west);
      alert("North's hand  " + hands.north);
    </script>
