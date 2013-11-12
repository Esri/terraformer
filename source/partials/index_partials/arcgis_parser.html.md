<header class="subhead">
  <img src="assets/images/terraformer-arcparser.png" alt="terraformer ArcGIS Parser">
  <h2>ArcGIS Parser</h2>
  <h3><a href="/" class="button button-light">Documentation</a> <a href="/" class="button button-light">Get ArcGIS Parser</a></h3>
</header>

Terraformer's ArcGIS Parser library allows you to convert between [Terraformer Primitives]() or [GeoJSON](http://geojson.org/geojson-spec.html) and the [ArcGIS Geometry Objects](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Geometry_Objects/02r3000000n1000000/)

```js
// parse ArcGIS JSON, convert it to a Terraformer.Primitive
var primitive = ArcGIS.parse({
  x:"-122.6764",
  y:"45.5165",
  spatialReference: {
    wkid: 4326
  }
});

// take a Terraformer.Primitive or GeoJSON and convert it to ArcGIS JSON
var point = ArcGIS.convert({
  "type": "Point",
  "coordinates": [45.5165, -122.6764]
});
```

[ArcGIS Parser Documentation](/)