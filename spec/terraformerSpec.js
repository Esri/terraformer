if(typeof module === "object"){
  var Terraformer = require("../dist/node/terraformer.js");
  var GeoJSON = require("./GeoJSON.js");
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
    multiPolygon = new Terraformer.Primitive(GeoJSON.multiPolygons[1]);
    expect(multiPolygon).toBeInstanceOfClass(Terraformer.MultiPolygon);
    expect(multiPolygon.coordinates).toEqual(GeoJSON.multiPolygons[1].coordinates);
  });

  it("should create a Feature from GeoJSON", function(){
    var feature = new Terraformer.Primitive(GeoJSON.features[0]);

    expect(feature).toBeInstanceOfClass(Terraformer.Feature);
    expect(feature.geometry.coordinates).toEqual(GeoJSON.features[0].geometry.coordinates);
    expect(feature.geometry.type).toEqual("Polygon");
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

      expect(mercator.coordinates).toEqual([101.99999999179026, 1.9999999236399357]);
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

    it("should convert a Primitive to stringified JSON", function(){
      var point = new Terraformer.Primitive(GeoJSON.points[0]);

      var json = point.toJson();

      expect(json).toEqual(JSON.stringify(point));
    });
  });

  describe("Point", function(){
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
        new Terraformer.Point(GeoJSON.multiPoints[1]);
      }).toThrow("Terraformer: invalid input for Terraformer.Point");
    });

    it("should calculate bounds", function(){
      expect(point.bbox).toEqual([45, 60, 45, 60]);
    });

    it("should calculate convex hull", function(){
      expect(point.convexHull()).toEqual([[45, 60]]);
    });

    it("should calculate envelope", function(){
      expect(point.envelope()).toEqual({ x: 45, y: 60, w: 0, h: 0 });
    });
  });

  describe("MultiPoint", function(){
    beforeEach(function(){
      multiPoint = new Terraformer.MultiPoint([ [100,0], [-45, 122] ]);
    });

    it("should create a MultiPoint from an array of GeoJSON Positions", function(){
      expect(multiPoint.coordinates).toEqual([ [100,0], [-45, 122] ]);
      expect(multiPoint.type).toEqual("MultiPoint");
    });

    it("should throw an error when called invalid data", function(){
      expect(function(){
        new Terraformer.MultiPoint(GeoJSON.points[1]);
      }).toThrow("Terraformer: invalid input for Terraformer.MultiPoint");
    });

    it("should have a getter for length", function(){
      expect(multiPoint.length).toEqual(2);
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
      expect(spy.callCount).toEqual(multiPoint.length);
      expect(spy).toHaveBeenCalledWith([100,0], 0, multiPoint.coordinates);
      expect(spy).toHaveBeenCalledWith([-45,122], 1, multiPoint.coordinates);
    });

    it("should calculate bounds", function(){
      expect(multiPoint.bbox).toEqual([-45, 0, 100, 122]);
    });

    it("should calculate convex hull", function(){
      expect(multiPoint.convexHull()).toEqual([[-45, 122], [100, 0]]);
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
      expect(lineString.bbox).toEqual([-45, 0, 100, 122]);
    });

    it("should calculate convex hull", function(){
      expect(lineString.convexHull()).toEqual([ [-45, 122], [100, 0]]);
    });

    it("should calculate envelope", function(){
      expect(lineString.envelope()).toEqual({ x : -45, y : 0, w : 145, h : 122 });
    });
  });

  describe("MultiLineString", function(){
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
      expect(multiLineString.length).toEqual(2);
    });

    it("should calculate bounds", function(){
      expect(multiLineString.bbox).toEqual([-115, 40, -100, 55]);
    });

    it("should calculate convex hull", function(){
      expect(multiLineString.convexHull()).toEqual([ [ -115, 55 ], [ -110, 45 ], [ -105, 40 ], [ -100, 40 ], [ -110, 55 ] ]);
    });

    it("should calculate envelope", function(){
      expect(multiLineString.envelope()).toEqual({ x : -115, y : 40, w : 15, h : 15 });
    });

    it("should get a line as a Primitive", function(){
      expect(multiLineString.get(0)).toBeInstanceOfClass(Terraformer.LineString);
      expect(multiLineString.get(0).coordinates).toEqual([ [-105, 40], [-110, 45], [-115, 55] ]);
    });
  });

  describe("Polygon", function(){
    beforeEach(function(){
      polygon = new Terraformer.Polygon([ [ [100.0, 0.0],[101.0, 0.0],[101.0, 1.0],[100.0, 1.0],[100.0, 0.0] ] ]);
    });

    it("should create a Polygon from an array of GeoJSON Positions", function(){
      expect(polygon.type).toEqual("Polygon");
      expect(polygon.coordinates).toEqual([ [ [100.0, 0.0],[101.0, 0.0],[101.0, 1.0],[100.0, 1.0],[100.0, 0.0] ] ]);
    });

    it("should throw an error when called invalid data", function(){
      expect(function(){
        new Terraformer.Polygon(GeoJSON.features[1]);
      }).toThrow("Terraformer: invalid input for Terraformer.Polygon");
    });

    it("should be able to add a vertex", function(){
      polygon.addVertex([45, 100]);
      expect(polygon.coordinates).toEqual([ [ [100.0, 0.0],[101.0, 0.0],[101.0, 1.0],[100.0, 1.0],[100.0, 0.0],[45, 100] ] ]);
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
      expect(polygon.bbox).toEqual([100, 0, 101, 1]);
    });

    it("should calculate convex hull", function(){
      expect(polygon.convexHull()).toEqual([ [ 100, 1 ], [ 100, 0 ], [ 101, 0 ], [ 101, 1 ] ]);
    });

    it("should contain a point", function(){
      expect(polygon.contains({type:"Point", coordinates: [ 100.5, 0.5 ]})).toEqual(true);
    });

    it("should calculate envelope", function(){
      expect(multiPoint.envelope()).toEqual({ x : -45, y : 0, w : 145, h : 122 });
    });

    it("should contain a polygon", function(){
      expect(polygon.contains({type:"Polygon", coordinates: [ [ [100.5, 0.5],[100.7, 0.5],[100.7, 0.7],[100.5, 0.7],[100.5, 0.5] ] ] })).toEqual(true);
    });

    it("should fail when does not contain a polygon", function(){
      expect(polygon.contains({type:"Polygon", coordinates: [ [ [101.5, 1.5],[101.7, 1.5],[101.7, 1.7],[101.5, 1.7],[101.5, 1.5] ] ] })).toEqual(false);
    });

    it("should fail when does not contain a multipolygon", function(){
      expect(polygon.contains({type:"MultiPolygon", coordinates: [ [ [ [101.5, 1.5],[101.7, 1.5],[101.7, 1.7],[101.5, 1.7],[101.5, 1.5] ] ] ] })).toEqual(false);
    });

    it("should contain a multipolygon", function(){
      expect(polygon.contains({type:"MultiPolygon", coordinates: [ [ [ [100.5, 0.5],[100.7, 0.5],[100.7, 0.7],[100.5, 0.7],[100.5, 0.5] ] ] ] })).toEqual(true);
    });
  });

  describe("Polygon with a Hole", function(){
    beforeEach(function(){
      polygon = new Terraformer.Polygon([
        [
          [100.0, 0.0],
          [101.0, 0.0],
          [101.0, 1.0],
          [100.0, 1.0],
          [100.0, 0.0]
        ],
        [
          [100.2, 0.2],
          [100.8, 0.2],
          [100.8, 0.8],
          [100.2, 0.8],
          [100.2, 0.2]
        ]
      ]);
    });

    it("should contain a point when not in hole", function() {
      expect(polygon.contains({type:"Point", coordinates: [100.1, 0.1]}));
    });

    it("should not contain a point when in hole", function() {
      expect(polygon.contains({type:"Point", coordinates: [100.3, 0.3]}));
    });
  });

  describe("MultiPolygon", function(){
    beforeEach(function(){
      multiPolygon = new Terraformer.MultiPolygon(GeoJSON.multiPolygons[0].coordinates);
    });

    it("should create a MultiPolygon from an array of GeoJSON Polygons", function(){
      expect(multiPolygon.type).toEqual("MultiPolygon");
      expect(multiPolygon.coordinates).toEqual(GeoJSON.multiPolygons[0].coordinates);
    });

    it("should throw an error when called invalid data", function(){
      expect(function(){
        new Terraformer.MultiPolygon(GeoJSON.multiPoints[0]);
      }).toThrow("Terraformer: invalid input for Terraformer.MultiPolygon");
    });

    it("should have a getter for length", function(){
      expect(multiPolygon.length).toEqual(2);
    });

    it("should calculate bounds", function(){
      expect(multiPolygon.bbox).toEqual([100, 0, 103, 3]);
    });

    it("should calculate convex hull", function (){
      expect(multiPolygon.convexHull()).toEqual([ [ 102, 3 ], [ 100, 1 ], [ 100, 0 ], [ 101, 0 ], [ 103, 2 ], [ 103, 3 ] ]);
    });

    it("should contain a point", function() {
      expect(multiPolygon.contains(new Terraformer.Point([102.5, 2.5]))).toEqual(true);
    });

    it("should calculate envelope", function(){
      expect(multiPolygon.envelope()).toEqual({ x : 100, y : 0, w : 3, h : 3 });
    });

    it("should get a polygon as a Primitive", function(){
      expect(multiPolygon.get(0)).toBeInstanceOfClass(Terraformer.Polygon);
      expect(multiPolygon.get(0).coordinates).toEqual(GeoJSON.multiPolygons[0].coordinates[0]);
    });
  });

  describe("Circle", function(){
    beforeEach(function(){
      circle = new Terraformer.Circle([-122, 45], 1000, 128);
    });

    it("should create a Circle Feature from a GeoJSON Position and a radius", function(){
      expect(circle.type).toEqual("Feature");
      expect(circle.geometry.type).toEqual("Polygon");
      expect(circle.geometry.coordinates[0].length).toEqual(128);
    });

    it("should throw an error when called invalid data", function(){
      expect(function(){
        new Terraformer.Circle();
      }).toThrow("Terraformer: missing parameter for Terraformer.Circle");
    });

    it("should have a getter for steps", function(){
      expect(circle.steps).toEqual(128);
    });

    it("should have a setter for steps", function(){
      circle.steps = 64;
      expect(circle.steps).toEqual(64);
    });

    it("should have a getter for radius", function(){
      expect(circle.radius).toEqual(1000);
    });

    it("should have a setter for radius", function(){
      circle.radius = 500;
      expect(circle.radius).toEqual(500);
    });

    it("should have a getter for center", function(){
      expect(circle.center).toEqual([-122,45]);
    });

    it("should have a setter for center", function(){
      circle.center = [80,50];
      expect(circle.center).toEqual([80,50]);
    });

    it("should calculate bounds", function(){
      expect(circle.bbox).toEqual([ -122.00898315283914, 44.99364759960156, -121.99101684715673, 45.00635169618245 ]);
    });

    it("should calculate envelope", function(){
      expect(circle.envelope()).toEqual({ x : -122.00898315283914, y : 44.99364759960156, w : 0.01796630568240687, h : 0.012704096580890223 });
    });

    it("should contain a point", function() {
      expect(circle.contains(new Terraformer.Point([-122, 45]))).toEqual(true);
    });
  });

  describe("Feature", function(){
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
      expect(feature.bbox).toEqual([21.79, 33.75, 56.95, 71.01]);
    });

    it("should calculate envelope", function(){
      expect(feature.envelope()).toEqual({ x : 21.79, y : 33.75, w : 35.160000000000004, h : 37.260000000000005 });
    });

    it("should contain a point", function() {
      expect(feature.contains(new Terraformer.Point([41.83,51.01]))).toEqual(true);
    });
  });

  describe("FeatureCollection", function(){
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
      expect(featureCollection.bbox).toEqual([ -104.99404, 33.75, 56.95, 71.01 ] );
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
      expect(geometryCollection.bbox).toEqual([ -84.32281494140625, 33.73804486328907, 56.95, 71.01 ]);
    });

    it("should calculate envelope", function(){
      expect(geometryCollection.envelope()).toEqual({ x : -84.32281494140625, y : 33.73804486328907, w : 141.27281494140624, h : 37.271955136710936 });
    });

    it("should get a Geometry as a Primitive", function(){
      expect(geometryCollection.get(0)).toBeInstanceOfClass(Terraformer.Polygon);
      expect(geometryCollection.get(0).coordinates).toEqual(GeoJSON.polygons[0].coordinates);
    });

  });
});

describe("Intersection", function(){
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
    beforeEach(function() {
      polygon = new Terraformer.Polygon([ [ [ 0, 0 ], [ 10, 0 ], [ 10, 5 ], [ 0, 5 ] ] ]);
    });

    it("should correctly figure out intersection with a Polygon", function(){
      expect(polygon.intersects(new Terraformer.Polygon([ [ [ 1, 1 ], [ 11, 1 ], [ 11, 6 ], [ 1, 6 ] ] ]))).toEqual(true);
    });

    it("should correctly figure out intersection with a MultiPolygon", function(){
      expect(polygon.intersects(new Terraformer.MultiPolygon([ [ [ [ 1, 1 ], [ 11, 1 ], [ 11, 6 ], [ 1, 6 ] ] ] ]))).toEqual(true);
    });
  });

  describe("Feature", function(){
    beforeEach(function() {
      feature = new Terraformer.Feature(      {
        "type": "Feature",
        "geometry":  {
          "type": "Polygon",
          "coordinates": [ [ [ 0, 0 ], [ 10, 0 ], [ 10, 5 ], [ 0, 5 ] ] ]
        }
      });
    });

    it("should correctly figure out intersection with a Polygon", function(){
      expect(polygon.intersects(new Terraformer.Polygon([ [ [ 1, 1 ], [ 11, 1 ], [ 11, 6 ], [ 1, 6 ] ] ]))).toEqual(true);
    });

    it("should correctly figure out intersection with a MultiPolygon", function(){
      expect(polygon.intersects(new Terraformer.MultiPolygon([ [ [ [ 1, 1 ], [ 11, 1 ], [ 11, 6 ], [ 1, 6 ] ] ] ]))).toEqual(true);
    });
  });

  describe("LineString", function(){
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
  });
});
