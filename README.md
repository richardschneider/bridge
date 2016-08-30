# bridge
[![Travis build status](https://travis-ci.org/richardschneider/bridge.svg)](https://travis-ci.org/richardschneider/bridge)
[![Coverage Status](https://coveralls.io/repos/github/richardschneider/bridge/badge.svg?branch=master)](https://coveralls.io/github/richardschneider/bridge?branch=master)
[![npm version](https://badge.fury.io/js/bridge.js.svg)](https://badge.fury.io/js/bridge.js) 

A javascript model for contract (duplicate) bridge.

The [change log](https://github.com/richardschneider/bridge/releases) is automatically produced with
the help of [semantic-release](https://github.com/semantic-release/semantic-release).

## Getting started

bridge.JS is available for both node.js and the browser 

### Node

Install with [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm)

    > npm install bridge.js --save

Include the package

    var bridge = require('bridge.js')

Use it to deal a random game

    var hands = new bridge.Deck()
        .shuffle()
        .deal(bridge.seat.west);
    console.log(hands.north)

### Browser

Include the package

    <script src="bridge.min.js" type="text/javascript"></script>

This will provide `bridge` as a global object, or `define` it if you are using [AMD](https://en.wikipedia.org/wiki/Asynchronous_module_definition).

    <script>
      var hands = new bridge.Deck()
          .shuffle()
          .deal(bridge.seat.west);
      alert("North's hand  " + hands.north);
    </script>


### Bower

Install it for your project

    bower install bridge.js --save
    
Include it your HTML page

    <script src="./bower-modules/bridge.js/dist/bridge.min.js"></script>
    
Use it

