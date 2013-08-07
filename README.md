# Terraformer Well-Known Text Parser

This package is part of the [Terraformer](https://github.com/Esri/Terraformer) project.

A bare-bones WKT parser.  Given a WKT primitive, it parses and returns a `Terraformer Primitive`.

## Installing

### Node.js

    $ npm install terraformer-wkt-parser

### Browser

In the browser, Terraformer is required to be used as well.

    $ bower install terraformer-wkt-parser

## Usage

### Node.js

    var wkt = require('terraformer-wkt-parser');
    
    // parse a WKT file, convert it into a primitive
    var primitive = wkt.parse('LINESTRING (30 10, 10 30, 40 40)');
    
    // take a primitive and convert it into a WKT representation
    var polygon = wkt.convert(
      {
        "type": "Polygon",
  	    "coordinates": [
          [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
          [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
        ]
      }
    );

### Browser

The Terraformer-WKT-Parser can be used in the browser with some simple includes.

    <!-- Load the main Terraformer library -->
    <script src="terraformer.min.js" type="text/javascript"></script>
    
    <!-- Load the WKT Parser -->
    <script src="terraformer-wkt-parser.min.js" type="text/javascript"></script>
    
    <!-- Use it! -->
    <script>
      var primitive = Terraformer.WKT.parse('LINESTRING (30 10, 10 30, 40 40)');
    </script>

### AMD (Require.js and Dojo)

Terraformer also works with AMD loaders like [RequireJS](http://requirejs.org/) and [Dojo](http://dojotoolkit.org/).

##### RequireJS

First you should register the Terraformer modules with RequireJS

    requirejs.config({
      //In order for proper loading of depenencies in Terraformer modules set the path up in requirejs.config
      paths: {
        terraformer: "/the/path/to/terraformer"
      }
    });

Then you can load Terraformer modules in your `require` statements.

    requirejs([
      "terraformer/terraformer",
      "terraformer/terraformer-wkt-parser"
    ], function (Terraformer, TerraformerWKT) {
      // Do stuff with terraformer core, wkt parser
    };

##### Dojo

Dojo includes a built in AMD loader. To use Terraformer with Dojo setup the path to Terraformer in your `dojoConfig`.

    dojoConfig= {
      async: true,
      packages: [{
        name: "terraformer",
        location: "/the/path/to/terraformer"
      }]
    }

You can then include Terraformer in your Dojo code

    require([
      "terraformer/terraformer",
      "terraformer/terraformer-wkt-parser"
    ], function (Terraformer, TerraformerWKT) {
      // Do stuff with terraformer core, and wkt parser
    });


[](Esri Tags: Terraformer GeoJSON WKT Well-Known-Text)
[](Esri Language: JavaScript)