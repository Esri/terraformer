# ArcGIS Parser

ArcGIS has its own Geographic format which is detailed [here](http://help.arcgis.com/en/arcgisserver/10.0/apis/rest/geometry.html).

This format predates GeoJSON and has a number of unique advantages especially for handing holes in polygons.

Terraformer provides support for converting this format to and from GeoJSON.

# Using in Node

Require the terraformer ArcGIS module.

    var TerraformerArcGIS = require("terraformer-arcgis");

# Using with AMD Loaders

Require the terraformer ArcGIS module. *Note: for this to work you will have to configure your loader to point to the Terraformer modules* Check out the [Leaflet w/ RequireJS example](https://github.com/Esri/Terraformer/tree/master/examples/require-js-leaflet) or the [Dojo/ArcGIS GeoJSON Viewer example](https://github.com/Esri/Terraformer/tree/master/examples/geojson-viewer) for how to do this.

```js
    require([
      "terraformer/arcgis"
    ], function(TerraformerArcGIS){
      // Convert Stuff!
    });
```

# Basic Browser Usage

Just add a script tag pointing to the ArcGIS parser.

```js
<script src="/terraformer.js">
<script src="/arcgis.js">
```

The parser will be availabe in the `Terraformer.ArcGIS` namespace.

# ArcGIS to GeoJSON

Use the `parse` method to convert ArcGIS to GeoJSON. You can pass any of the JSON objects from [spec](http://help.arcgis.com/en/arcgisserver/10.0/apis/rest/geometry.html) or [Graphics](http://help.arcgis.com/en/webapi/javascript/arcgis/jsapi/#graphic) or [Geometries](http://help.arcgis.com/en/webapi/javascript/arcgis/jsapi/#geometry) from the [ArcGIS Javascript API](http://help.arcgis.com/en/webapi/javascript/arcgis/)

This will return an instance of `Terraformer.Primitive`

```js
var arcgis = {
  "x" : -118.15,
  "y" : 33.80,
  "spatialReference" : {
    "wkid" : 4326
  }
};

var geojson = Terraformer.ArcGIS.parse(arcgis);
```

### Converting ArcGIS Features
Terraformer also supports converting "features" from ArcGIS into GeoJSON Features.

```js
var feature = {
  "geometry": {
    "rings": [
      [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
    ],
    "spatialReference": {
      "wkid": 4326
    }
  },
  "attributes": {
    "foo": "bar"
  }
}

var geojson = Terraformer.ArcGIS.parse(feature);

// Terraformer does not handle setting ids on features
geojson.id = "myfeature_01";
```

### Notes

It is important to note that Terraformer **DOES NOT** attempt to set an ID on the feature is outputs. You should always set an id after parsing it to GeoJSON. This is because the concept a unique feature id does not exist in the ArcGIS spec.

# GeoJSON to ArcGIS

To convert Terraformer objects or just GeoJSON use the `convert` method. This will return the ArcGIS JSON representation of the object.

```js
var point = new Terraformer.Point(-122.6764, 45.5165);

var arcgis = Terraformer.ArcGIS.convert(point);
```

### Notes

Terraformer will also handle converting `FeatureCollection` and `GeometryCollection` objects to arrays of ArcGIS geometries or feautres. However it will **Not** do this in reverse as there is no official structure for arrays of features in ArcGIS and all the output features will not have `id` properties. See [this issue](https://github.com/Esri/Terraformer/issues/104) for more details.