import Terraformer = require("./terraformer");

console.assert(typeof Terraformer !== undefined);

let point = new Terraformer.Primitive({
  type: "Point",
  coordinates: [1, 2]
});

console.assert(point instanceof Terraformer.Point); // -> true
console.assert(point instanceof Terraformer.Primitive); // -> true

// point.within(polygon); // -> true or false

let point1 = new Terraformer.Point({
  type: "Point",
  coordinates: [1, 2]
});

let point2 = new Terraformer.Point(1, 2);

let point3 = new Terraformer.Point([1, 2]);


let linestring = new Terraformer.LineString({
  type: "LineString",
  coordinates: [[1, 2], [2, 1]]
});

linestring = new Terraformer.LineString([[1, 2], [2, 1]]);

let multilinestring = new Terraformer.MultiLineString({
  type: "MultiLineString",
  coordinates: [[[1, 2], [2, 1]]]
});

multilinestring = new Terraformer.MultiLineString([[[1, 1], [2, 2], [3, 4]], [[0, 1], [0, 2], [0, 3]]]);


let polygon1 = new Terraformer.Polygon({
  "type": "Polygon",
  "coordinates": [
    [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
    [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]
  ]
});

let polygon2 = new Terraformer.Polygon([
  [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
  [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]
]);

let multipolygon1 = new Terraformer.MultiPolygon({
  "type": "MultiPolygon",
  "coordinates": [[
    [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
    [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]
  ]]
});

let multipolygon2 = new Terraformer.MultiPolygon([
  [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
  [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]
]);

let feature1 = new Terraformer.Feature<GeoJSON.Polygon>({
  "type": "Feature",
  "properties": null,
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
      [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]
    ]
  }
});

let feature2 = new Terraformer.Feature({
  "type": "Polygon",
  "coordinates": [
    [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
    [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]
  ]
});

let featurecollection1 = new Terraformer.FeatureCollection({
  "type": "FeatureCollection",
  "features": [feature1, feature2]
});

let featurecollection2 = new Terraformer.FeatureCollection([feature1, feature2]);

let geometrycollection1 = new Terraformer.GeometryCollection({
  "type": "GeometryCollection",
  "geometries": [point2, polygon1]
});

let geometrycollection2 = new Terraformer.GeometryCollection([point2, polygon1]);

let circle = new Terraformer.Circle([45.65, -122.27], 500, 64);

circle.contains(point1);

let pt = [-111.467285, 40.75766];
let pt2 = [-111.873779, 40.647303];

let polygon = {
  "type": "Polygon",
  "coordinates": [[
    [-112.074279, 40.52215],
    [-112.074279, 40.853293],
    [-111.610107, 40.853293],
    [-111.610107, 40.52215],
    [-112.074279, 40.52215]
  ]]
};

let polygonGeometry = polygon.coordinates;

Terraformer.Tools.polygonContainsPoint(polygonGeometry, pt);
// returns false
Terraformer.Tools.polygonContainsPoint(polygonGeometry, pt2);
// returns true