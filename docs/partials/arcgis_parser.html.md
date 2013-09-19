### <a href="/" class="button button-light">Get ArcGIS Parser</a>
## ArcGIS Parser

<h4> Primitives </h4>

The Terraformer Primitives are classes that map directly to their GeoJSON equivalents, adding convenience methods, geometric tools such as `within`, and `intersects` and spatial reference conversion methods.

<h4> Tools </h4>

Terraformer also exposes many generic tools for working with geographic data.

    // search for a point
    var envelope = {
      x: 101,
      y: 11,
      h: 0,
      w: 0
    };

    // should call the callback with results of [ { rowId: 23 } ]
    index.search(envelope, function (err, results) {
      // results [ { rowId: 23 } ]
    });

[ArcGIS Parser Documentation](/)