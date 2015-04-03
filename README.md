# bridge.js
A javascript model for contract (duplicate) bridge.

## Getting started

Install it for your project

    bower install bridge.js --save
    
Include it your HTML page

    <script src="dist/bridge.min.js"></script>
    
Use it

    <script>
      var hands = new bridge.Deck().shuffle().deal(bridge.seat.west);
      alert("North's hand  " + hands.north);
    </script>
