# Terraformer Well-Known Text Parser

This package is part of the [Terraformer](https://github.com/Geoloqi/Terraformer) project.

A bare-bones WKT parser.  Given a WKT primitive, it parses and returns a `Terraformer Primitive`.

## Installing

    $ npm install terraformer-wkt 

## Usage

    var wkt = require('terraformer-wkt');
    
    var primitive = wkt.parse('LINESTRING (30 10, 10 30, 40 40)');
    

