<header class="subhead">
  <img src="assets/images/terraformer-wktparser.png" alt="terraformer WKT Parser">
  <h2>Well Known Text Parser</h2>
  <h3>
    <a href="/wkt-parser/" class="button button-light">Documentation</a>
    <a href="/install/#wkt-parser" class="button button-light">Get WKT Parser</a>
  </h3>
</header>

[Well Known Text](http://en.wikipedia.org/wiki/Well-known_text) is a format used by databases like PostGIS. With Terraformer's WKT parser you can convert between this format and GeoJSON.

```js
// parse a WKT file, convert it into a primitive
var primitive = Terraformer.WKT.parse('LINESTRING (30 10, 10 30, 40 40)');

// take a primitive and convert it into a WKT representation
var polygon = Terraformer.WKT.convert({
  "type": "Polygon",
  "coordinates": [
    [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
    [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
  ]
});
```