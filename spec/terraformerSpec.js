if(typeof module === "object"){
  var Terraformer = require("../terraformer.js");
  var GeoJSON = require("./geojsonHelpers.js");
}

beforeEach(function() {
  this.addMatchers({
    toBeInstanceOfClass: function(classRef){
      return this.actual instanceof classRef;
    }
  });
});

describe("Primitives", function(){

  it("should create a Point from GeoJSON", function(){
    var point = new Terraformer.Primitive(GeoJSON.points[1]);

    expect(point).toBeInstanceOfClass(Terraformer.Point);
    expect(point.coordinates).toEqual(GeoJSON.points[1].coordinates);
  });

  it("should create a MultiPoint from GeoJSON", function(){
    var multiPoint = new Terraformer.Primitive(GeoJSON.multiPoints[1]);

    expect(multiPoint).toBeInstanceOfClass(Terraformer.MultiPoint);
    expect(multiPoint.coordinates).toEqual(GeoJSON.multiPoints[1].coordinates);
  });

  it("should create a LineString from GeoJSON", function(){
    var lineString = new Terraformer.Primitive(GeoJSON.lineStrings[3]);

    expect(lineString).toBeInstanceOfClass(Terraformer.LineString);
    expect(lineString.coordinates).toEqual(GeoJSON.lineStrings[3].coordinates);
  });

  it("should create a MultiLineString from GeoJSON", function(){
    var multiLineString = new Terraformer.Primitive(GeoJSON.multiLineStrings[1]);

    expect(multiLineString).toBeInstanceOfClass(Terraformer.MultiLineString);
    expect(multiLineString.coordinates).toEqual(GeoJSON.multiLineStrings[1].coordinates);
  });

  it("should create a Polygon from GeoJSON", function(){
    var polygon = new Terraformer.Primitive(GeoJSON.polygons[2]);
    expect(polygon).toBeInstanceOfClass(Terraformer.Polygon);
    expect(polygon.coordinates).toEqual(GeoJSON.polygons[2].coordinates);
  });

  it("should create a MultiPolygon from GeoJSON", function(){
    var multiPolygon = new Terraformer.Primitive(GeoJSON.multiPolygons[1]);
    expect(multiPolygon).toBeInstanceOfClass(Terraformer.MultiPolygon);
    expect(multiPolygon.coordinates).toEqual(GeoJSON.multiPolygons[1].coordinates);
  });

  it("should create a Feature from GeoJSON", function(){
    var feature = new Terraformer.Primitive(GeoJSON.features[0]);
    expect(feature).toBeInstanceOfClass(Terraformer.Feature);
    expect(feature.geometry.coordinates).toEqual(GeoJSON.features[0].geometry.coordinates);
    expect(feature.geometry.type).toEqual("Polygon");
  });

  it("should create a Feature from GeoJSON with null geometry and properties", function(){
    var feature = new Terraformer.Primitive({
      type: "Feature",
      geometry: null,
      properties: null
    });

    expect(feature).toBeInstanceOfClass(Terraformer.Feature);
    expect(feature.geometry).toEqual(null);
    expect(feature.properties).toEqual(null);
    expect(feature.type).toEqual("Feature");
  });

  it("should create a FeatureCollection from GeoJSON", function(){
    var featureCollection = new Terraformer.Primitive(GeoJSON.featureCollections[0]);

    expect(featureCollection).toBeInstanceOfClass(Terraformer.FeatureCollection);
    expect(featureCollection.features[0].geometry.coordinates).toEqual(featureCollection.features[0].geometry.coordinates);
    expect(featureCollection.features[0].geometry.type).toEqual("Polygon");
  });

  it("should create a GeometryCollection from GeoJSON", function(){
    var geometryCollection = new Terraformer.Primitive(GeoJSON.geometryCollections[0]);

    expect(geometryCollection).toBeInstanceOfClass(Terraformer.GeometryCollection);
    expect(geometryCollection.geometries.length).toEqual(2);
  });

  describe("Helper Methods", function(){
    it("should convert a Primitive to Web Mercator", function(){
      var point = new Terraformer.Primitive(GeoJSON.points[2]);

      var mercator = point.toMercator();

      expect(mercator.coordinates).toEqual([11131949.079327168, 0]);
      expect(mercator.crs).toEqual(Terraformer.MercatorCRS);
    });

    it("should convert a Primitive to Geographic coordinates", function(){
      var point = new Terraformer.Primitive({
        "type": "Point",
        "coordinates": [11354588.06,222684.20]
      });

      var mercator = point.toGeographic();

      expect(mercator.coordinates[0]).toBeCloseTo(101.99999999179026, 10);
      expect(mercator.coordinates[1]).toBeCloseTo(1.9999999236399357, 10);
    });

    it("should convert a Primitive to JSON", function(){
      var geometryCollection = new Terraformer.Primitive(GeoJSON.geometryCollections[0]);
      var json = geometryCollection.toJSON();
      expect(json.bbox).toBeTruthy();
      expect(json.type).toBeTruthy();
      expect(json.geometries).toBeTruthy();
      expect(json.length).toBeFalsy();
    });

    it("should convert a Circle Primitive to JSON", function(){
      var circle = new Terraformer.Circle([45.5165, -1226764], 100);
      var json = circle.toJSON();
      expect(json.bbox).toBeTruthy();
      expect(json.type).toEqual("Feature");
      expect(json.geometry).toBeTruthy();
      expect(json.geometry.coordinates).toBeTruthy();
      expect(json.geometry.bbox).toBeFalsy();
      expect(json.center).toBeFalsy();
      expect(json.steps).toBeFalsy();
      expect(json.radius).toBeFalsy();
      expect(json.properties.center).toBeTruthy();
      expect(json.properties.steps).toBeTruthy();
      expect(json.properties.radius).toBeTruthy();
    });
  });

  describe("Point", function(){
    var point;

    beforeEach(function(){
      point = new Terraformer.Point(45, 60);
    });

    it("should create a Point from a 'x' and 'y'", function(){
      expect(point.coordinates).toEqual([45,60]);
    });

    it("should create a Point from a GeoJSON Position", function(){
      var point = new Terraformer.Point([45, 60]);
      expect(point.coordinates).toEqual([45,60]);
    });

    it("should throw an error when called invalid data", function(){
      expect(function(){
        point = new Terraformer.Point(GeoJSON.multiPoints[1]);
      }).toThrow("Terraformer: invalid input for Terraformer.Point");
    });

    it("should calculate bounds", function(){
      expect(point.bbox()).toEqual([45, 60, 45, 60]);
    });

    it("should calculate convex hull", function(){
      expect(point.convexHull()).toEqual(null);
    });

    it("should calculate convex hull using Tools", function(){
      expect(Terraformer.Tools.convexHull([ point.coordinates ])).toEqual([[45, 60]]);
    });

    it("should be able to tell a non-convex polygon using Tools", function(){
      expect(Terraformer.Tools.isConvex(GeoJSON.polygons[1].coordinates[0])).toEqual(false);
    });

    it("should be able to tell a convex polygon using Tools", function(){
      expect(Terraformer.Tools.isConvex(GeoJSON.polygons[0].coordinates[0])).toEqual(true);
    });

    it("should calculate envelope", function(){
      expect(point.envelope()).toEqual({ x: 45, y: 60, w: 0, h: 0 });
    });
  });

  describe("MultiPoint", function(){
    var multiPoint;

    beforeEach(function(){
      multiPoint = new Terraformer.MultiPoint([ [100,0], [-45, 122] ]);
    });

    it("should create a MultiPoint from an array of GeoJSON Positions", function(){
      expect(multiPoint.coordinates).toEqual([ [100,0], [-45, 122] ]);
      expect(multiPoint.type).toEqual("MultiPoint");
    });

    it("should throw an error when called invalid data", function(){
      expect(function(){
        multiPoint = new Terraformer.MultiPoint(GeoJSON.points[1]);
      }).toThrow("Terraformer: invalid input for Terraformer.MultiPoint");
    });

    it("should be able to add a point", function(){
      multiPoint.addPoint([80,-60]);
      expect(multiPoint.coordinates).toEqual([ [100,0],[-45, 122],[80,-60] ]);
    });

    it("should be able to insert a point", function(){
      multiPoint.insertPoint([80,-60], 1);
      expect(multiPoint.coordinates).toEqual([ [100,0],[80,-60],[-45, 122] ]);
    });

    it("should be able to remove a point by index", function(){
      multiPoint.removePoint(1);
      expect(multiPoint.coordinates).toEqual([ [100, 0] ]);
    });

    it("should be able to remove a point by position", function(){
      multiPoint.removePoint([-45, 122]);
      expect(multiPoint.coordinates).toEqual([ [100,0] ]);
    });

    it("should be able to itterate over all points", function(){
      var spy = jasmine.createSpy();
      multiPoint.forEach(spy);
      expect(spy.callCount).toEqual(multiPoint.coordinates.length);
      expect(spy).toHaveBeenCalledWith([100,0], 0, multiPoint.coordinates);
      expect(spy).toHaveBeenCalledWith([-45,122], 1, multiPoint.coordinates);
    });

    it("should calculate bounds", function(){
      expect(multiPoint.bbox()).toEqual([-45, 0, 100, 122]);
    });

    it("should calculate convex hull", function(){
      multiPoint.addPoint([80,-60]);
      expect(multiPoint.convexHull().type).toEqual("Polygon");
      expect(multiPoint.convexHull().coordinates).toEqual(
        [ [ [ 100, 0 ], [ -45, 122 ], [ 80, -60 ], [ 100, 0 ] ] ]
      );
    });

    it("should return null when a convex hull cannot return a valid Polygon", function(){
      expect(multiPoint.convexHull()).toEqual(null);
    });

    it("should calculate envelope", function(){
      expect(multiPoint.envelope()).toEqual({ x : -45, y : 0, w : 145, h : 122 });
    });

    it("should get a point as a Primitive", function(){
      expect(multiPoint.get(0)).toBeInstanceOfClass(Terraformer.Point);
      expect(multiPoint.get(0).coordinates).toEqual([100,0]);
    });
  });

  describe("LineString", function(){
    var lineString;

    beforeEach(function(){
      lineString = new Terraformer.LineString([ [100,0], [-45, 122] ]);
    });

    it("should create a Line from an array of GeoJSON Positions", function(){
      expect(lineString.type).toEqual("LineString");
      expect(lineString.coordinates).toEqual([ [100,0], [-45, 122] ]);
    });

    it("should throw an error when called invalid data", function(){
      expect(function(){
        new Terraformer.LineString(GeoJSON.features[1]).toThrow();
      }).toThrow("Terraformer: invalid input for Terraformer.LineString");
    });

    it("should be able to add a vertex", function(){
      lineString.addVertex([80,-60]);
      expect(lineString.coordinates).toEqual([ [100,0],[-45, 122],[80,-60] ]);
    });

    it("should be able to insert a vertex", function(){
      lineString.insertVertex([80,-60], 1);
      expect(lineString.coordinates).toEqual([ [100,0],[80,-60],[-45, 122] ]);
    });

    it("should be able to remove a vertex by index", function(){
      lineString.removeVertex(1);
      expect(lineString.coordinates).toEqual([ [100, 0] ]);
    });

    it("should calculate bounds", function(){
      expect(lineString.bbox()).toEqual([-45, 0, 100, 122]);
    });

    it("should calculate convex hull", function(){
      lineString.addVertex([80,-60]);
      expect(lineString.convexHull().type).toEqual("Polygon");
      expect(lineString.convexHull().coordinates).toEqual([
        [ [ 100, 0 ], [ -45, 122 ], [ 80, -60 ], [ 100, 0 ] ]
      ]);
    });

    it("should return null when a convex hull cannot return a valid Polygon", function(){
      expect(lineString.convexHull()).toEqual(null);
    });

    it("should calculate envelope", function(){
      expect(lineString.envelope()).toEqual({ x : -45, y : 0, w : 145, h : 122 });
    });
  });

  describe("MultiLineString", function(){
    var multiLineString;

    beforeEach(function(){
      multiLineString = new Terraformer.MultiLineString([
        [ [-105, 40], [-110, 45], [-115, 55] ],
        [ [-100, 40], [-105, 45], [-110, 55] ]
      ]);
    });

    it("should create a MultiLineString from an array of GeoJSON LineStrings", function(){
      expect(multiLineString.type).toEqual("MultiLineString");
      expect(multiLineString.coordinates).toEqual([
        [ [-105, 40], [-110, 45], [-115, 55] ],
        [ [-100, 40], [-105, 45], [-110, 55] ]
      ]);
    });

    it("should throw an error when called invalid data", function(){
      expect(function(){
        new Terraformer.MultiLineString(GeoJSON.features[1]).toThrow();
      }).toThrow("Terraformer: invalid input for Terraformer.MultiLineString");
    });

    it("should have a getter for length", function(){
      expect(multiLineString.coordinates.length).toEqual(2);
    });

    it("should calculate bounds", function(){
      expect(multiLineString.bbox()).toEqual([-115, 40, -100, 55]);
    });

    it("should calculate convex hull", function(){
      expect(multiLineString.convexHull().type).toEqual("Polygon");
      expect(multiLineString.convexHull().coordinates).toEqual([
        [ [ -100, 40 ], [ -110, 55 ], [ -115, 55 ], [ -110, 45 ], [ -105, 40 ], [ -100, 40 ] ]
      ]);
    });

    it("should calculate envelope", function(){
      expect(multiLineString.envelope()).toEqual({ x : -115, y : 40, w : 15, h : 15 });
    });

    it("should get a line as a Primitive", function(){
      expect(multiLineString.get(0)).toBeInstanceOfClass(Terraformer.LineString);
      expect(multiLineString.get(0).coordinates).toEqual([ [-105, 40], [-110, 45], [-115, 55] ]);
    });

    it("should work with forEach correctly", function(){
      var count = 0;
      multiLineString.forEach(function () {
        count++;
      });

      expect(count).toEqual(2);
    });

  });

  describe("Polygon", function(){
    var polygon;
    var polygonWithHoles;

    beforeEach(function(){
      polygon = new Terraformer.Polygon([ [ [100.0, 0.0],[101.0, 0.0],[101.0, 1.0],[100.0, 1.0],[100.0, 0.0] ] ]);
      polygonWithHoles = new Terraformer.Polygon([
        [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
        [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
      ]);
    });

    it("should create a Polygon from an array of GeoJSON Positions", function(){
      expect(polygon.type).toEqual("Polygon");
      expect(polygon.coordinates).toEqual([ [ [100.0, 0.0],[101.0, 0.0],[101.0, 1.0],[100.0, 1.0],[100.0, 0.0] ] ]);
    });

    it("should throw an error when called invalid data", function(){
      expect(function(){
        polygon = new Terraformer.Polygon(GeoJSON.features[1]);
      }).toThrow("Terraformer: invalid input for Terraformer.Polygon");
    });

    it("should be able to add a vertex", function(){
      polygon.addVertex([45, 100]);
      expect(polygon.coordinates).toEqual([ [ [100.0, 0.0],[101.0, 0.0],[101.0, 1.0],[100.0, 1.0],[45, 100],[100.0, 0.0] ] ]);
    });

    it("should be able to insert a vertex", function(){
      polygon.insertVertex([45, 100], 1);
      expect(polygon.coordinates).toEqual([ [ [100.0, 0.0],[45, 100],[101.0, 0.0],[101.0, 1.0],[100.0, 1.0],[100.0, 0.0] ] ]);
    });

    it("should be able to remove a vertex by index", function(){
      polygon.removeVertex(0);
      expect(polygon.coordinates).toEqual([ [ [101.0, 0.0],[101.0, 1.0],[100.0, 1.0],[100.0, 0.0] ] ]);
    });

    it("should calculate bounds", function(){
      expect(polygon.bbox()).toEqual([100, 0, 101, 1]);
    });

    it("should calculate convex hull", function(){
      expect(polygon.convexHull().coordinates).toEqual([
        [ [ 101, 1 ], [ 100, 1 ], [ 100, 0 ], [ 101, 0 ], [ 101, 1 ] ]
      ]);
      expect(polygon.convexHull().type).toEqual("Polygon");
    });

    it("should calculate envelope", function(){
      expect(polygon.envelope()).toEqual({ x : 100.0, y : 0, w : 1, h : 1 });
    });

    it("should report hole presence properly", function() {
      expect(polygon.hasHoles()).toEqual(false);
      expect(polygonWithHoles.hasHoles()).toEqual(true);
    });

    it("should return an array of polygons of each hole", function() {
      var hole = new Terraformer.Polygon([[[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]);
      expect(polygonWithHoles.holes()).toEqual([hole]);
    });
  });

  describe("MultiPolygon", function(){
    var multiPolygon, mp;

    beforeEach(function(){
      multiPolygon = new Terraformer.MultiPolygon(GeoJSON.multiPolygons[0].coordinates);
    });

    it("should create a MultiPolygon from an array of GeoJSON Polygons", function(){
      expect(multiPolygon.type).toEqual("MultiPolygon");
      expect(multiPolygon.coordinates).toEqual(GeoJSON.multiPolygons[0].coordinates);
    });

    it("should return true when a MultiPolygon intersects another", function(){
      mp = new Terraformer.MultiPolygon([
        [
          [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0] ]
        ],
        [
          [ [100.0, 0.0], [102.0, 0.0], [102.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
        ]
      ]);

      expect(multiPolygon.intersects(mp)).toEqual(true);
    });

    it("should throw an error when called invalid data", function(){
      expect(function(){
        multiPolygon = new Terraformer.MultiPolygon(GeoJSON.multiPoints[0]);
      }).toThrow("Terraformer: invalid input for Terraformer.MultiPolygon");
    });

    it("should have a getter for length", function(){
      expect(multiPolygon.coordinates.length).toEqual(2);
    });

    it("should calculate bounds", function(){
      expect(multiPolygon.bbox()).toEqual([100, 0, 103, 3]);
    });

    it("should calculate convex hull", function (){
      expect(mp.convexHull().coordinates).toEqual([
        [ [ 103, 3 ],
          [ 102, 3 ],
          [ 100, 1 ],
          [ 100, 0 ],
          [ 102, 0 ],
          [ 103, 2 ],
          [ 103, 3 ] ]
      ]);
      expect(multiPolygon.convexHull().type).toEqual("Polygon");
    });

    it("should calculate envelope", function(){
      expect(multiPolygon.envelope()).toEqual({ x : 100, y : 0, w : 3, h : 3 });
    });

    it("should get a polygon as a Primitive", function(){
      expect(multiPolygon.get(0)).toBeInstanceOfClass(Terraformer.Polygon);
      expect(multiPolygon.get(0).coordinates).toEqual(GeoJSON.multiPolygons[0].coordinates[0]);
    });

    it("should work with forEach correctly", function(){
      var count = 0;
      multiPolygon.forEach(function () {
        count++;
      });

      expect(count).toEqual(2);
    });

    it("should be able to be closed", function(){
      var unclosed = new Terraformer.MultiPolygon({
        "type": "MultiPolygon",
        "coordinates": [
          [
            [ [102.0, 2.0],[103.0, 2.0],[103.0, 3.0],[102.0, 3.0] ],
            [ [102.2, 2.2],[102.8, 2.2],[102.8, 2.8],[102.2, 2.8] ]
          ],
          [
            [ [100.0, 0.0],[101.0, 0.0],[101.0, 1.0],[100.0, 1.0] ],
            [ [100.2, 0.2],[100.8, 0.2],[100.8, 0.8],[100.2, 0.8] ]
          ]
        ]
      });

      unclosed.close();

      unclosed.forEach(function(poly){
        expect(poly[0].length).toEqual(5);
        expect(poly[0][0][0]).toEqual(poly[0][poly[0].length-1][0]);
        expect(poly[0][0][1]).toEqual(poly[0][poly[0].length-1][1]);
      });

    });

  });

  describe("Circle", function(){
    var circle;

    beforeEach(function(){
      circle = new Terraformer.Circle([-122, 45], 1000, 128);
    });

    it("should create a Circle Feature from a GeoJSON Position and a radius", function(){
      expect(circle.type).toEqual("Feature");
      expect(circle.geometry.type).toEqual("Polygon");
      expect(circle.geometry.coordinates[0].length).toEqual(129); // 128 + 1 to close the circle
    });

    it("should throw an error when called invalid data", function(){
      expect(function(){
        circle = new Terraformer.Circle();
      }).toThrow("Terraformer: missing parameter for Terraformer.Circle");
    });

    it("should form a closed polygon", function(){
      expect(circle.geometry.coordinates[0][0][0]).toEqual(circle.geometry.coordinates[0][circle.geometry.coordinates[0].length-1][0]);
      expect(circle.geometry.coordinates[0][0][1]).toEqual(circle.geometry.coordinates[0][circle.geometry.coordinates[0].length-1][1]);
    });

    it("should have a getter for steps", function(){
      expect(circle.steps()).toEqual(128);
    });

    it("should have a setter for steps", function(){
      circle.steps(64);
      expect(circle.properties.steps).toEqual(64);
    });

    it("should have a getter for radius", function(){
      expect(circle.radius()).toEqual(1000);
    });

    it("should have a setter for radius", function(){
      circle.radius(500);
      expect(circle.properties.radius).toEqual(500);
    });

    it("should have a getter for center", function(){
      expect(circle.center()).toEqual([-122,45]);
    });

    it("should have a setter for center", function(){
      circle.center([80,50]);
      expect(circle.properties.center).toEqual([80,50]);
    });

    it("should calculate bounds", function(){
      expect(circle.bbox()[0]).toBeCloseTo(-122.0089831528, 10);
      expect(circle.bbox()[1]).toBeCloseTo(44.9936475996, 10);
      expect(circle.bbox()[2]).toBeCloseTo(-121.9910168472, 10);
      expect(circle.bbox()[3]).toBeCloseTo(45.0063516962, 10);

    });

    it("should calculate envelope", function(){
      expect(circle.envelope().x).toBeCloseTo(-122.0089831528, 10);
      expect(circle.envelope().y).toBeCloseTo(44.9936475996, 10);
      expect(circle.envelope().w).toBeCloseTo(0.0179663057, 10);
      expect(circle.envelope().h).toBeCloseTo(0.0127040966, 10);
    });

  });

  describe("Feature", function(){
    var feature;

    beforeEach(function(){
      feature = new Terraformer.Feature(GeoJSON.polygons[0]);
    });

    it("should create a Feature from a GeoJSON Geometry", function(){
      expect(feature.type).toEqual("Feature");
      expect(feature.geometry.type).toEqual("Polygon");
      expect(feature.geometry.coordinates).toEqual(GeoJSON.polygons[0].coordinates);
    });

    it("should throw an error when called invalid data", function(){
      expect(function(){
        new Terraformer.Feature({
          type: "Polygon"
        }).toThrow("Terraformer: invalid input for Terraformer.Feature");
      });
    });

    it("should calculate bounds", function(){
      expect(feature.bbox()).toEqual([21.79, 33.75, 56.95, 71.01]);
    });

    it("should calculate envelope", function(){
      expect(feature.envelope()).toEqual({ x : 21.79, y : 33.75, w : 35.160000000000004, h : 37.260000000000005 });
    });

    it("should calculate convex hull", function(){
      expect(feature.convexHull().type).toEqual("Polygon");
      expect(feature.convexHull().coordinates).toEqual([
        [ [ 56.95, 33.75 ], [ 41.83, 71.01 ], [ 21.79, 36.56 ], [ 56.95, 33.75 ] ]
      ]);
    });

  });

  describe("FeatureCollection", function(){
    var featureCollection;

    beforeEach(function(){
      featureCollection = new Terraformer.FeatureCollection([
        GeoJSON.features[0], GeoJSON.features[1]
      ]);
    });

    it("should create a FeatureCollection from an array of GeoJSON Features", function(){
      expect(featureCollection.features.length).toEqual(2);
      expect(featureCollection.features[0]).toEqual(GeoJSON.features[0]);
      expect(featureCollection.features[1]).toEqual(GeoJSON.features[1]);
    });

    it("should throw an error when called invalid data", function(){
      expect(function(){
        new Terraformer.FeatureCollection({
          "type": "Polygon"
        }).toThrow("Terraformer: invalid input for Terraformer.FeatureCollection");
      });
    });

    it("should calculate bounds", function(){
      expect(featureCollection.bbox()).toEqual([ -104.99404, 33.75, 56.95, 71.01 ] );
    });

    it("should calculate envelope", function(){
      expect(featureCollection.envelope()).toEqual({ x : -104.99404, y : 33.75, w : 161.94404, h : 37.260000000000005 });
    });

    it("should get a Feature as a Primitive", function(){
      expect(featureCollection.get("foo")).toBeInstanceOfClass(Terraformer.Feature);
      expect(featureCollection.get("foo").geometry.coordinates).toEqual(GeoJSON.features[0].geometry.coordinates);
    });
  });

  describe("GeometryCollection", function(){
    var geometryCollection;

    beforeEach(function() {
      geometryCollection = new Terraformer.GeometryCollection([GeoJSON.polygons[0], GeoJSON.polygons[1]]);
    });

    it("should create a GeometryCollection from an array of GeoJSON Geometries", function(){
      expect(geometryCollection.geometries.length).toEqual(2);
      expect(geometryCollection.geometries[0]).toEqual(GeoJSON.polygons[0]);
      expect(geometryCollection.geometries[1]).toEqual(GeoJSON.polygons[1]);
    });

    it("should throw an error when called invalid data", function(){
      expect(function(){
        new Terraformer.GeometryCollection({
          "type": "Polygon"
        }).toThrow("Terraformer: invalid input for Terraformer.GeometryCollection");
      });
    });

    it("should calculate bounds", function(){
      expect(geometryCollection.bbox()).toEqual([ -84.32281494140625, 33.73804486328907, 56.95, 71.01 ]);
    });

    it("should calculate envelope", function(){
      expect(geometryCollection.envelope()).toEqual({ x : -84.32281494140625, y : 33.73804486328907, w : 141.27281494140624, h : 37.271955136710936 });
    });

    it("should get a Geometry as a Primitive", function(){
      expect(geometryCollection.get(0)).toBeInstanceOfClass(Terraformer.Polygon);
      expect(geometryCollection.get(0).coordinates).toEqual(GeoJSON.polygons[0].coordinates);
    });

    it("should work with forEach correctly", function(){
      var count = 0;
      geometryCollection.forEach(function () {
        count++;
      });

      expect(count).toEqual(2);
    });

  });
});

describe("Intersection", function(){
  var multiLineString;

  describe("MultiLineString", function(){
    beforeEach(function() {
      multiLineString = new Terraformer.MultiLineString([ [ [ 0, 0 ], [ 10, 10 ] ], [ [ 5, 5 ], [ 15, 15 ] ] ]);
    });

    it("should correctly figure out intersection with a LineString", function() {
      expect(multiLineString.intersects(new Terraformer.LineString([ [ 0, 10 ], [ 15, 5 ] ]))).toEqual(true);
    });

    it("should correctly figure out intersection with a MultiLineString", function (){
      expect(multiLineString.intersects(new Terraformer.MultiLineString([ [ [ 0, 10 ], [ 15, 5 ] ] ]))).toEqual(true);
    });

    it("should correctly figure out intersection with a Polygon", function (){
      expect(multiLineString.intersects(new Terraformer.Polygon([ [ [ 0, 5 ], [ 10, 5 ], [ 10, 0 ], [ 0, 0 ] ] ]))).toEqual(true);
    });

    it("should correctly figure out intersection with a MultiPolygon", function (){
      expect(multiLineString.intersects(new Terraformer.MultiPolygon([ [ [ [ 0, 5 ], [ 10, 5 ], [ 10, 0 ], [ 0, 0 ] ] ] ]))).toEqual(true);
    });
  });

  describe("Polygon", function(){
    var polygon;

    beforeEach(function() {
      polygon = new Terraformer.Polygon([ [ [ 0, 0 ], [ 10, 0 ], [ 10, 5 ], [ 0, 5 ] ] ]);
    });

    it("should correctly figure out intersection of the same object", function(){
      expect(polygon.intersects(polygon)).toEqual(true);
    });

    it("should correctly figure out intersection with a Polygon", function(){
      expect(polygon.intersects(new Terraformer.Polygon([ [ [ 1, 1 ], [ 11, 1 ], [ 11, 6 ], [ 1, 6 ] ] ]))).toEqual(true);
    });

    it("should correctly figure out intersection with a MultiPolygon", function(){
      expect(polygon.intersects(new Terraformer.MultiPolygon([ [ [ [ 1, 1 ], [ 11, 1 ], [ 11, 6 ], [ 1, 6 ] ] ] ]))).toEqual(true);
    });

    it("should correctly figure out intersection with a Polygon", function(){
      expect(polygon.intersects(new Terraformer.Polygon([ [ [ 1, 1 ], [ 11, 1 ], [ 11, 6 ], [ 1, 6 ] ] ]))).toEqual(true);
    });

    it("should correctly figure out intersection with a MultiLineString", function(){
      expect(polygon.intersects(new Terraformer.MultiLineString([ [ [ 1, 1 ], [ 11, 1 ], [ 11, 6 ], [ 1, 6 ] ] ]))).toEqual(true);
    });

    it("should correctly figure out intersection with a LineString", function(){
      expect(polygon.intersects(new Terraformer.LineString([ [ 1, 1 ], [ 11, 1 ], [ 11, 6 ], [ 1, 6 ] ]))).toEqual(true);
    });

    it("should correctly figure out intersection with a MultiPolygon", function(){
      expect(polygon.intersects(new Terraformer.MultiPolygon([ [ [ [ 1, 1 ], [ 11, 1 ], [ 11, 6 ], [ 1, 6 ] ] ] ]))).toEqual(true);
    });

    it("should correctly figure out intersection with a MultiPolygon in reverse", function(){
      var mp = new Terraformer.MultiPolygon([ [ [ [ 1, 1 ], [ 11, 1 ], [ 11, 6 ], [ 1, 6 ] ] ] ]);
      expect(mp.intersects(polygon)).toEqual(true);
    });

  });

  describe("MultiPolygon", function(){
    var multiPolygon;

    beforeEach(function() {
      multiPolygon = new Terraformer.MultiPolygon([ [ [ [ 48.5, -122.5 ], [ 50, -123 ], [ 48.5, -122.5 ] ] ] ]);
    });

    it("should return false if two MultiPolygons do not intersect", function() {
      var mp = new Terraformer.MultiPolygon([ [ [ [ 1, 2 ], [ 3, 4 ], [ 5, 6 ] ] ] ]);
      expect(multiPolygon.intersects(mp)).toEqual(false);
    });
  });

  describe("Feature", function(){
    var feature;

    beforeEach(function() {
      feature = new Terraformer.Feature(      {
        "type": "Feature",
        "geometry":  {
          "type": "Polygon",
          "coordinates": [ [ [ 0, 0 ], [ 10, 0 ], [ 10, 5 ], [ 0, 5 ] ] ]
        }
      });
    });

  });

  describe("LineString", function(){
    var lineString;

    beforeEach(function() {
      lineString = new Terraformer.LineString([ [ 45, -122 ], [ 46, -123 ] ]);
    });

    it("should correctly figure out intersection with a LineString", function(){
      expect(lineString.intersects(new Terraformer.LineString([ [46, -121], [44, -124] ]))).toEqual(true);
    });

    it("should correctly figure out that parallel lines are not intersections", function(){
      expect(lineString.intersects(new Terraformer.LineString([ [44,-121], [45, -122] ]))).toEqual(false);
    });

    it("should correctly figure out that the same lines are not intersections", function(){
      expect(lineString.intersects(new Terraformer.LineString([ [45,-122], [46, -123] ]))).toEqual(false);
    });

    it("should correctly figure out intersection with Polygon", function(){
      expect(lineString.intersects(new Terraformer.Polygon([ [ [ 45.5, -122.5 ], [ 47, -123 ], [ 45.5, -122.5 ] ] ]))).toEqual(true);
    });

    it("should correctly figure out lack of intersection with Polygon", function(){
      expect(lineString.intersects(new Terraformer.Polygon([ [ [ 48.5, -122.5 ], [ 50, -123 ], [ 48.5, -122.5 ] ] ]))).toEqual(false);
    });

    it("should correctly figure out intersection with MultiLineString", function(){
      expect(lineString.intersects(new Terraformer.MultiLineString([ [ [ 45.5, -122.5 ], [ 47, -123 ], [ 45.5, -122.5 ] ] ]))).toEqual(true);
    });

    it("should correctly figure out lack of intersection with MultiLineString", function(){
      expect(lineString.intersects(new Terraformer.MultiLineString([ [ [ 48.5, -122.5 ], [ 50, -123 ], [ 48.5, -122.5 ] ] ]))).toEqual(false);
    });

    it("should correctly figure out intersection with MultiPolygon", function(){
      expect(lineString.intersects(new Terraformer.MultiPolygon([ [ [ [ 45.5, -122.5 ], [ 47, -123 ], [ 45.5, -122.5 ] ] ] ]))).toEqual(true);
    });

    it("should correctly figure out lack of intersection with MultiPolygon", function(){
      expect(lineString.intersects(new Terraformer.MultiPolygon([ [ [ [ 48.5, -122.5 ], [ 50, -123 ], [ 48.5, -122.5 ] ] ] ]))).toEqual(false);
    });

    it("should correctly figure out lack of intersection with MultiPolygon in reverse", function(){
      var mp = new Terraformer.MultiPolygon([ [ [ [ 48.5, -122.5 ], [ 50, -123 ], [ 48.5, -122.5 ] ] ] ]);
      expect(mp.intersects(lineString)).toEqual(false);
    });

  });

  describe("Point Within", function(){
    var point;

    beforeEach(function(){
      point = new Terraformer.Point([ 10, 10 ]);
    });

    it("should return true when inside a polygon", function(){
      var polygon = new Terraformer.Polygon([ [ [ 5, 5 ], [ 5, 15 ], [ 15, 15 ], [ 15, 5 ], [ 5, 5 ] ] ]);
      expect(point.within(polygon)).toEqual(true);
    });

    it("should return false when not inside a polygon", function(){
      var polygon = new Terraformer.Polygon([ [ [ 25, 25 ], [ 25, 35 ], [ 35, 35 ], [ 35, 25 ], [ 25, 25 ] ] ]);
      expect(point.within(polygon)).toEqual(false);
    });

    it("should return true when it is the same point", function(){
      var npoint = new Terraformer.Point([ 10, 10 ]);
      expect(point.within(npoint)).toEqual(true);
    });

    it("should return false when it is not the same point", function(){
      var npoint = new Terraformer.Point([ 11, 11 ]);
      expect(point.within(npoint)).toEqual(false);
    });

    it("should return true when inside a multipolygon", function() {
      var mp = new Terraformer.MultiPolygon([ [ [ [ 25, 25 ], [ 25, 35 ], [ 35, 35 ], [ 35, 25 ], [ 25, 25 ] ] ], [ [ [ 5, 5 ], [ 15, 5 ], [ 15, 15 ], [ 5, 15 ], [ 5, 5 ] ] ] ]);
      expect(point.within(mp)).toEqual(true);
    });

    it("should return false when not inside a multipolygon", function() {
      var mp = new Terraformer.MultiPolygon([ [ [ [ 25, 25 ], [ 25, 35 ], [ 35, 35 ], [ 35, 25 ], [ 25, 25 ] ] ], [ [ [ 15, 15 ], [ 25, 15 ], [ 25, 25 ], [ 15, 25 ], [ 15, 15 ] ] ] ]);
      expect(point.within(mp)).toEqual(false);
    });

    it("should return false when inside a hole of a polygon", function(){
      var polygon = new Terraformer.Polygon([ [ [ 5, 5 ], [ 5, 15 ], [ 15, 15 ], [ 15, 5 ], [ 5, 5 ] ], [ [ 9, 9 ], [ 9, 11 ], [ 11, 11 ], [ 11, 9 ], [ 9, 9 ] ] ]);
      expect(point.within(polygon)).toEqual(false);
    });

    it("should return true when not inside a hole of a polygon", function(){
      var polygon = new Terraformer.Polygon([ [ [ 5, 5 ], [ 5, 15 ], [ 15, 15 ], [ 15, 5 ], [ 5, 5 ] ], [ [ 9, 9 ], [ 9, 9.5 ], [ 9.5, 9.5 ], [ 9.5, 9 ], [ 9, 9 ] ] ]);
      expect(point.within(polygon)).toEqual(true);
    });

  });

  describe("MultiPolygon Within", function(){
    var multipolygon;

    beforeEach(function(){
      multipolygon = new Terraformer.MultiPolygon([ [ [ [ 5, 5 ], [ 5, 15 ], [ 15, 15 ], [ 15, 5 ], [ 5, 5 ] ] ], [ [ [ 25, 25 ], [ 25, 35 ], [ 35, 35 ], [ 35, 25 ], [ 25, 25 ] ] ] ]);
    });

    it("should return true if a linestring is within a multipolygon", function(){
      var linestring = new Terraformer.LineString([ [ 6, 6 ], [ 6, 14 ] ]);
      expect(linestring.within(multipolygon)).toEqual(true);
    });

    it("should return true if a multipoint is within a multipolygon", function(){
      var linestring = new Terraformer.MultiPoint([ [ 6, 6 ], [ 6, 14 ] ]);
      expect(linestring.within(multipolygon)).toEqual(true);
    });

    it("should return true if a multilinestring is within a multipolygon", function () {
      var mls = new Terraformer.MultiLineString([ [ [ 6, 6 ], [ 6, 14 ] ] ]);
      expect(mls.within(multipolygon)).toEqual(true);
    });

    it("should return false if a part of a multilinestring is not within a multipolygon", function () {
      var mls = new Terraformer.MultiLineString([ [ [ 6, 6 ], [ 6, 14 ] ], [ [ 1, 1 ], [ 1, 2 ] ] ]);
      expect(mls.within(multipolygon)).toEqual(false);
    });

    it("should return true if a multipolygon is within a multipolygon", function () {
      var mp = new Terraformer.MultiPolygon([ [ [ [ 1, 1 ], [ 1, 40 ], [ 40, 40 ], [ 40, 1 ], [ 1, 1 ] ] ] ]);
      expect(multipolygon.within(mp)).toEqual(true);
    });

  });

  describe("More Point Within", function() {
    var point;

    beforeEach(function(){
      point = new Terraformer.Point([ 6, 6 ]);
    });

    it("should return true if a point is within a multipoint", function(){
      var multipoint = new Terraformer.MultiPoint([ [ 1, 1 ], [ 2, 2 ], [ 3, 3 ], [ 6, 6 ] ]);
      expect(point.within(multipoint)).toEqual(true);
    });

    it("should return false if a point is within a multipoint with different length", function(){
      var multipoint = new Terraformer.MultiPoint([ [ 1, 1, 1 ], [ 2, 2, 2 ], [ 3, 3, 3 ], [ 6, 6, 6 ] ]);
      expect(point.within(multipoint)).toEqual(false);
    });

    it("should return true if a point is within a linestring", function(){
      var linestring = new Terraformer.LineString([ [ 1, 1 ], [ 2, 2 ], [ 3, 3 ], [ 6, 6 ] ]);
      expect(point.within(linestring)).toEqual(true);
    });

    it("should return true if a point is within a multilinestring", function(){
      var linestring = new Terraformer.MultiLineString([ [ [ 1, 1 ], [ 2, 2 ], [ 3, 3 ], [ 6, 6 ] ] ]);
      expect(point.within(linestring)).toEqual(true);
    });

  });

  describe("Polygon Within", function(){
    var polygon;

    beforeEach(function(){
      polygon = new Terraformer.Polygon([ [ [ 5, 5 ], [ 5, 15 ], [ 15, 15 ], [ 15, 5 ], [ 5, 5 ] ] ]);
    });

    it("should return true when inside a polygon", function(){
      var polygon2 = new Terraformer.Polygon([ [ [ 3, 3 ], [ 3, 18 ], [ 18, 18 ], [ 18, 3 ], [ 3, 3 ] ] ]);
      expect(polygon.within(polygon2)).toEqual(true);
    });

    it("should return false when not inside a polygon", function(){
      var polygon2 = new Terraformer.Polygon([ [ [ 25, 25 ], [ 25, 35 ], [ 35, 35 ], [ 35, 25 ], [ 25, 25 ] ] ]);
      expect(polygon.within(polygon2)).toEqual(false);
    });

    it("should return true when it is the same polygon", function(){
      var polygon2 = new Terraformer.Polygon([ [ [ 5, 5 ], [ 5, 15 ], [ 15, 15 ], [ 15, 5 ], [ 5, 5 ] ] ]);
      expect(polygon.within(polygon2)).toEqual(true);
    });

    it("should return true when inside a multipolygon", function() {
      var mp = new Terraformer.MultiPolygon([ [ [ [ 25, 25 ], [ 25, 35 ], [ 35, 35 ], [ 35, 25 ], [ 25, 25 ] ] ], [ [ [ 3, 3 ], [ 18, 3 ], [ 18, 18 ], [ 3, 18 ], [ 3, 3 ] ] ] ]);
      expect(polygon.within(mp)).toEqual(true);
    });

    it("should return false when not inside a multipolygon", function() {
      var mp = new Terraformer.MultiPolygon([ [ [ [ 25, 25 ], [ 25, 35 ], [ 35, 35 ], [ 35, 25 ], [ 25, 25 ] ] ], [ [ [ 15, 15 ], [ 25, 15 ], [ 25, 25 ], [ 15, 25 ], [ 15, 15 ] ] ] ]);
      expect(polygon.within(mp)).toEqual(false);
    });

    it("should return true when one of the polygons is the same polygon", function(){
      var mp = new Terraformer.MultiPolygon([ [ [ [ 5, 5 ], [ 5, 15 ], [ 15, 15 ], [ 15, 5 ], [ 5, 5 ] ] ], [ [ [ 1, 1 ], [ 1, 2 ], [ 2, 1 ] ] ] ]);
      expect(polygon.within(mp)).toEqual(true);
    });

    it("should return true if all of the points in a linestring are in the same polygon", function(){
      var ls = new Terraformer.LineString([ [ 6, 6 ], [ 6, 14 ], [ 14, 14 ] ]);
      expect(ls.within(polygon)).toEqual(true);
    });

    it("should return true if all of the points in a multipoint are in the same polygon", function(){
      var ls = new Terraformer.MultiPoint([ [ 6, 6 ], [ 6, 14 ], [ 14, 14 ] ]);
      expect(ls.within(polygon)).toEqual(true);
    });

    it("should return false if one of the points in a linestring leave the polygon", function(){
      var ls = new Terraformer.LineString([ [ 6, 6 ], [ 6, 14 ], [ 16, 16 ] ]);
      expect(ls.within(polygon)).toEqual(false);
    });

    it("should return false if one of the points in a multipoint leave the polygon", function(){
      var ls = new Terraformer.MultiPoint([ [ 6, 6 ], [ 6, 14 ], [ 16, 16 ] ]);
      expect(ls.within(polygon)).toEqual(false);
    });

    it("should return true if a multilinestring is within a polygon", function () {
      var mls = new Terraformer.MultiLineString([ [ [ 6, 6 ], [ 6, 14 ] ] ]);
      expect(mls.within(polygon)).toEqual(true);
    });

    it("should return false if a part of a multilinestring is not within a polygon", function () {
      var mls = new Terraformer.MultiLineString([ [ [ 6, 6 ], [ 6, 14 ] ], [ [ 1, 1 ], [ 1, 2 ] ] ]);
      expect(mls.within(polygon)).toEqual(false);
    });

    it("should return true if a multipolygon is within a polygon", function () {
      var mp = new Terraformer.MultiPolygon([ [ [ [ 6, 14 ], [ 14, 14 ], [ 14, 6 ], [ 6, 6 ], [ 6, 14 ] ] ] ]);
      expect(mp.within(polygon)).toEqual(true);
    });

    it("should return false if an empty LineString is checked within a polygon", function(){
      var ls = new Terraformer.LineString([]);
      expect(ls.within(polygon)).toEqual(false);
    });

  });

  describe("Catch All", function(){
    it("should return an empty array for an empty convexHull", function() {
      expect(Terraformer.Tools.convexHull([])).toEqual([]);
    });

    it("should return null for convexHull of empty Point", function() {
      var point = new Terraformer.Point([]);
      expect(point.convexHull()).toEqual(null);
    });

    it("should return null for an empty convexHull for LineString", function() {
      var ls = new Terraformer.LineString([]);
      expect(ls.convexHull()).toEqual(null);
    });

    it("should return an empty array for an empty convexHull for Polygon", function() {
      var p = new Terraformer.Polygon([]);
      expect(p.convexHull()).toEqual(null);
    });

    it("should return an empty array for an empty convexHull for MultiPolygon", function() {
      var mp = new Terraformer.MultiPolygon([]);
      expect(mp.convexHull()).toEqual(null);
    });

    it("should return an empty array for an empty convexHull for Feature", function() {
      var f = new Terraformer.Feature({
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: []
        }
      });
      expect(f.convexHull()).toEqual(null);
    });

    it("should throw an error for an unknow type in Primitive", function(){
      expect(function(){
        var f = new Terraformer.Primitive({type: "foobar"});
      }).toThrow("Unknown type: foobar");
    });

    it("should throw an error for an unknow type in calculateBounds", function(){
      expect(function(){
        Terraformer.Tools.calculateBounds({type: "foobar"});
      }).toThrow("Unknown type: foobar");
    });

    it("should return null when there is no geometry in a Feature in calculateBounds", function(){
      var bounds = Terraformer.Tools.calculateBounds({type: "Feature", geomertry: null});
      expect(bounds).toEqual(null);
    });

    it("should return true when polygonContainsPoint is passed the right stuff", function() {
      expect(Terraformer.Tools.polygonContainsPoint([], [])).toEqual(false);
    });

    it("should return false when polygonContainsPoint is passed an empty polygon", function() {
      var pt = [-111.873779, 40.647303];
      var polygon = [[
        [-112.074279, 40.52215],
        [-112.074279, 40.853293],
        [-111.610107, 40.853293],
        [-111.610107, 40.52215],
        [-112.074279, 40.52215]
      ]]

      expect(Terraformer.Tools.polygonContainsPoint(polygon, pt)).toEqual(true);
    });

    it("should return false if a polygonContainsPoint is called and the point is outside the polygon", function(){
      expect(Terraformer.Tools.polygonContainsPoint([[1,2], [2,2], [2,1], [1, 1], [1, 2]], [10,10])).toEqual(false);
    });

    it("should return false if coordinatesEqual are given non-equal lengths", function(){
      expect(Terraformer.Tools.coordinatesEqual([ [1, 2] ], [ [ 1, 2 ], [ 2, 3 ] ])).toEqual(false);
    });

    it("should return false if coordinatesEqual coordinates are non-equal lengths", function(){
      expect(Terraformer.Tools.coordinatesEqual([ [1, 2] ], [ [ 1, 2, 3 ] ])).toEqual(false);
    });
  });

});
