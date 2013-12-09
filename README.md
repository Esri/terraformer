# Terraformer

Terraformer is a modular toolkit for working with geographic data.

## Modules

The Terraformer project to broken up into a series of smaller modules.

* [Terraformer Core](http://terraformer.io/core/) - Contains methods and objects for working with GeoJSON. This also contains common methods used by other modules.
* [WKT Parser](http://terraformer.io/wkt-parser/) - Parse Well Known Text into GeoJSON and vica-versa.
* [ArcGIS Geometry Parser](http://terraformer.io/arcgis-parser/) - Parse the [ArcGIS Geometry Format](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Geometry_Objects/02r3000000n1000000/) into GeoJSON and vica-versa.
* [GeoStore](http://terraformer.io/geostore/) - A framework for persisting and querying GeoJSON features with pluggable indexes and persistant stores.

## Features

* Designed to work in Node and the browser
* No dependancies of other tools or libraries

## Getting Started

Check out the getting [started guide](http://terraformer.io/getting-started/) which will give you an overview of core concepts and methods in Terraformer.

## Documentation

Make sure your check out the full documentation on the [Terraformer website](http://terraformer.io/core/) and the [getting started guide](http://terraformer.io/getting-started/).

```js
var polygon = new Terraformer.Primitive({
  "type": "Polygon",
  "coordinates": [
    [
      [-122.66589403152467, 45.52290150862236],
      [-122.66926288604736, 45.52291654238294],
      [-122.67115116119385, 45.518406234030586],
      [-122.67325401306151, 45.514000817199715],
      [-122.6684260368347, 45.5127377671934],
      [-122.66765356063841, 45.51694782364431],
      [-122.66589403152467, 45.52290150862236 ]
    ]
  ]
});

var point = new Terraformer.Primitive({
  "type": "Point",
  "coordinates": [-122.66947746276854, 45.51775972687403]
});
```

Now that you have a point and a polygon primitive you can use the primitive helper methods.

```js
// add a new vertex to our polygon
polygon.insertVertex([-122.6708507537842, 45.513188859735436], 2);

// figure out if our point is within our polygon
point.within(polygon); // returns true
```

You can also have Terraformer perform many geometric operations like convex hulls and bounding boxes.

```js
var convexHull = polygon.convexHull();

point.within(convexHull); // returns true

var boundingBox = polygon.bbox(); // returns the geojson bounding box for this object.
```

## Resources

* [Terraformer Website](http://terraformer.io)
* [twitter@EsriPDX](http://twitter.com/esripdx)

## Building the documentation

To build the site locally, first `bundle install` then `bundle exec middleman` to run a local server. Once you're satisfied, run `bundle exec middleman build`, then `grunt gh-pages` to deploy to github pages.

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

[](Esri Tags: Terraformer GeoJSON)
[](Esri Language: JavaScript)
