---
title: WKT Parser
layout: documentation
---

# WKT Parser

<!-- table_of_contents -->

[Well Known Text](http://en.wikipedia.org/wiki/Well-known_text) is a format used by databases like PostGIS. With Terraformer's WKT parser you can convert between this format and GeoJSON.

## Using the WKT Parser

The WKT parser can be used client-side in a browser and server-side via Node.js.

```js
// parse a WKT string, converting it into a Terraformer.Primitive
var geojson = Terraformer.WKT.parse('LINESTRING (30 10, 10 30, 40 40)');

// take a primitive and convert it into a WKT representation
var polygon = Terraformer.WKT.convert({
  "type": "Polygon",
  "coordinates": [
    [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
    [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
  ]
});
```

### Using in the Browser

In the browser, the core [Terraformer](http://github.com/esri/terraformer) library is required.

```html
<script src="terraformer.min.js"></script>
<script src="terraformer-wkt-parser.min.js"></script>
<script>
  //Terraformer and Terraformer.WKT will be defined.
</script>
```

You can also use [Bower](http://bower.io/) to install the components if you like, or download them and host them yourself.

```
$ bower install terraformer-wkt-parser
```

### Using in Node.js

Just install the package from NPM with `$ npm install terraformer-wkt-parser`. Then include it in your application.

```js
var WKT = require('terraformer-wkt-parser');

// Start using the parse and convert methods!
```

### Methods

#### WKT.parse(string)

`Terraformer.WKT.parse(string)` - Converts a WKT string into a [Terraformer.Primitive](/core/#terraformerprimitive).

```js
var geojson = Terraformer.WKT.parse('LINESTRING (30 10, 10 30, 40 40)');
```

#### WKT.convert(geojson)

`Terraformer.WKT.convert(geoJSON)` will turn a GeoJSON [geometry object](http://geojson.org/geojson-spec.html#geometry-objects) or a Terraformer Primitive into WKT.

##### Example

```js
var polygon = Terraformer.WKT.convert({
  "type": "Polygon",
  "coordinates": [
    [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
    [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
  ]
});
```
