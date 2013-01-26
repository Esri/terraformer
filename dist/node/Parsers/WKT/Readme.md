# Terraformer Well-Known Text Parser

This package is part of the [Terraformer](https://github.com/Geoloqi/Terraformer) project.

A bare-bones WKT parser.  Given a WKT primitive, it parses and returns a `Terraformer Primitive`.

## Installing

    $ npm install terraformer-wkt 

## Usage

    var wkt = require('terraformer-wkt');
    
    var primitive = wkt.parse('LINESTRING (30 10, 10 30, 40 40)');
    
    var polygon = wkt.convert(
      {
        "type": "Polygon",
  	    "coordinates": [
          [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
          [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
        ]
      }
    );
