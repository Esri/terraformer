### <a href="/" class="button button-light">Get ArcGIS Parser</a>
## ArcGIS Parser

> <img src="/img/terraformer-parser.png" />

Terraformer's ArcGIS Parser library allows you to convert between [Terraformer Primitives]() or [GeoJSON](http://geojson.org/geojson-spec.html) and the [ArcGIS Geometry Objects](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Geometry_Objects/02r3000000n1000000/)

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