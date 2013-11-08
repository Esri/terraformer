---
layout: default
---

# Terraformer ArcGIS JSON Parser

This plugin handles 2 way conversion between [GeoJSON](http://geojson.org/geojson-spec.html) and the [ArcGIS Geometry](http://help.arcgis.com/en/arcgisserver/10.0/apis/rest/geometry.html) format used by Esri.

This package is part of the [Terraformer](https://github.com/Esri/Terraformer) project.

### Node.js

    $ npm install terraformer-arcgis-parser

### Browser

In the browser, the core [Terraformer](http://github.com/esri/terraformer) library is required.

You can also use [Bower](http://bower.io/) to install the components if you like or download them and host them yourself.

```
$ bower install terraformer
$ bower install terraformer-arcgis-parser
```

## `parse(arcgisJson, options)`

`Terraformer.ArcGIS.convert(json, options)` - Converts a GeoJSON or a [Terraformer.Primitive]() into the ArdGIS JSON format.

#### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `sr` | Number | 4236 | This is used to set the value of `spatialReference.wkid` on the output. By default this will use 4326. |
| `idAttribute` | String | "OBJECTID" |  When converting GeoJSON Features the `id` key of your feature will be set on the `OBJECTID` field in your output. If you want to assign your id to a different key you should set this to the string of the key your wish to assign the `id` to. |

#### Notes
Terraformer will also handle converting `FeatureCollection` and `GeometryCollection` objects to arrays of ArcGIS geometries or features. However it will **Not** do this in reverse as there is no official structure for arrays of features and geometries in ArcGIS and all the output features will not have `id` properties. See [this issue](https://github.com/Esri/Terraformer/issues/104) for more details.

The `parse` method is also aliased as `fromGeoJSON`.

## `convert(geojson, options)`
`Terraformer.ArcGIS.convert(geoJSON, options)` will convert GeoJSON or a Terraformer Primitive to ArcGIS JSON.

#### Options
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `idAttribute` | `String` | `"OBJECTID" || "FID"` | When converting ArcGIS Feature the `attributes` will contain id of the feature. This is usually called `OBJECTID` or `FID`. If your feature does not use the `OBJECTID` or `FID` keys as its id, you should define what the key representing your Features ID is.

#### Notes
If the object is in the Web Mercator spatial reference it will be converted to WGS84.

The `convert` method is also aliased as `toGeoJSON`.

#### Node.js Example

```js
var ArcGIS = require('terraformer-arcgis-parser');

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

### Browser Example

```html
  <!-- Load the main Terraformer library -->
  <script src="terraformer.min.js" type="text/javascript"></script>
  
  <!-- Load the ArcGIS Parser -->
  <script src="terraformer-arcgis-parser.min.js" type="text/javascript"></script>
  
  <!-- Use it! -->
  <script>
    var primitive = Terraformer.ArcGIS.parse({
      x:"-122.6764",
      y:"45.5165",
      spatialReference: {
        wkid: 4326
      }
    });

    // take a Terraformer.Primitive or GeoJSON and convert it to ArcGIS JSON
    var point = Terraformer.ArcGIS.convert({
      "type": "Point",
      "coordinates": [45.5165, -122.6764]
    });
  </script>
  ```