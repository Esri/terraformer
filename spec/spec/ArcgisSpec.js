if(typeof module === "object" && !Terraformer){
  var Terraformer = require("../../src/terraformer.js");
}

describe("ArcGIS Parser", function(){

  describe("Convert GeoJSON to ArcGIS", function(){
    it("Point", function() {
      var input = {
        "type": "Point",
        "coordinates": [-58.7109375,47.4609375]
      };

      var output = Terraformer.ArcGIS.convert(input);
      expect(output).toEqual({
        "x":-58.7109375,
        "y":47.4609375,
        "spatialReference":{
          "wkid":4326
        }
      });
    });

    it("Line", function() {
      var input = {
        "type": "LineString",
        "coordinates": [ [21.4453125,-14.0625],[33.3984375,-20.7421875],[38.3203125,-24.609375] ]
      };

      output = Terraformer.ArcGIS.convert(input);

      expect(output).toEqual({
        "paths":[
          [ [21.4453125,-14.0625],[33.3984375,-20.7421875],[38.3203125,-24.609375] ]
        ],
        "spatialReference":{
          "wkid":4326
        }
      });
    });

    it("Polygon", function() {
      var input = {
        "type": "Polygon",
        "coordinates": [
          [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
        ]
      };

      output = Terraformer.ArcGIS.convert(input);

      expect(output).toEqual({
        "rings":[
          [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
        ],
        "spatialReference":{
          "wkid":4326
        }
      });
    });

    it("Polygon w/ Hole", function() {
      var input = {
        "type": "Polygon",
        "coordinates": [
          [ [100.0,0.0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0] ],
          [ [100.2,0.2],[100.8,0.2],[100.8,0.8],[100.2,0.8],[100.2,0.2] ]
        ]
      };

      output = Terraformer.ArcGIS.convert(input);

      expect(output).toEqual({
        "rings": [
          [ [100.0,0.0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0] ],
          [ [100.2,0.2],[100.8,0.2],[100.8,0.8],[100.2,0.8],[100.2,0.2] ]
        ],
        "spatialReference":{
          "wkid":4326
        }
      });
    });

    it("MultiPoint", function() {
      var input = {
        "type": "MultiPoint",
        "coordinates": [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625] ]
      };

      output = Terraformer.ArcGIS.convert(input);

      expect(output).toEqual({
        "points":[ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625] ],
        "spatialReference":{
          "wkid":4326
        }
      });
    });

    it("MultiLineString", function() {
      var input = {
        "type": "MultiLineString",
        "coordinates": [
          [ [41.8359375,71.015625],[56.953125,33.75] ],
          [ [21.796875,36.5625],[47.8359375,71.015625] ]
        ]
      };

      output = Terraformer.ArcGIS.convert(input);

      expect(output).toEqual({
        "paths":[
          [ [41.8359375,71.015625],[56.953125,33.75] ],
          [ [21.796875,36.5625],[47.8359375,71.015625] ]
        ],
        "spatialReference":{
          "wkid":4326
        }
      });
    });

    it("MultiPolygon", function() {
      var input = {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0] ]
          ],
          [
            [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
          ]
        ]
      };

      output = Terraformer.ArcGIS.convert(input);

      expect(output).toEqual({
        "rings":[
          [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0] ],
          [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
        ],
        "spatialReference": {
          "wkid":4326
        }
      });
    });

    it("Multipolygon w/ Holes", function() {
      var input = {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0] ]
          ],
          [
            [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
            [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
          ]
        ]
      };

      output = Terraformer.ArcGIS.convert(input);

      expect(output).toEqual({
        "rings":[
          [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0] ],
          [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
          [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
        ],
        "spatialReference": {
          "wkid":4326
        }
      });
    });
  });

  describe("Parse ArcGIS to Geojson", function(){
    it("should convert a point", function() {
      var input = {
        "x": -66.796875,
        "y": 20.0390625,
        "spatialReference": {
          "wkid": 4326
        }
      };

      output = Terraformer.ArcGIS.parse(input);

      expect(output.coordinates).toEqual([-66.796875,20.0390625]);
      expect(output).toBeInstanceOfClass(Terraformer.Point);
    });

    it("should convert a line", function() {
      var input = {
        "paths": [
          [ [6.6796875,47.8125],[-65.390625,52.3828125],[-52.3828125,42.5390625] ]
        ],
        "spatialReference": {
          "wkid": 4326
        }
      };

      output = Terraformer.ArcGIS.parse(input);

      expect(output.coordinates).toEqual([ [6.6796875,47.8125],[-65.390625,52.3828125],[-52.3828125,42.5390625] ]);
      expect(output).toBeInstanceOfClass(Terraformer.LineString);
    });

    it("should convert a polygon", function() {
      var input = {
        "rings": [
          [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
        ],
        "spatialReference": {
          "wkid": 4326
        }
      };

      output = Terraformer.ArcGIS.parse(input);

      expect(output.coordinates).toEqual([[ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]]);
      expect(output).toBeInstanceOfClass(Terraformer.Polygon);
    });

    it("should convert a multipoint", function() {
      var input = {
        "points":[ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625] ],
        "spatialReference":{
          "wkid":4326
        }
      };

      var output = Terraformer.ArcGIS.parse(input);

      expect(output.coordinates).toEqual([ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625] ]);
      expect(output).toBeInstanceOfClass(Terraformer.MultiPoint);
    });

    it("should convert a line with multiple paths", function() {
      var input = {
        "paths":[
          [ [41.8359375,71.015625],[56.953125,33.75] ],
          [ [21.796875,36.5625],[41.8359375,71.015625] ]
        ],
        "spatialReference":{
          "wkid":4326
        }
      };

      var output = Terraformer.ArcGIS.parse(input);

      expect(output.coordinates).toEqual([[ [41.8359375,71.015625],[56.953125,33.75] ], [ [21.796875,36.5625],[41.8359375,71.015625] ]]);
      expect(output).toBeInstanceOfClass(Terraformer.MultiLineString);
    });

    it("should convert a polygon with multiple rings", function() {
      var input = {
        "rings":[
          [[-122.63,45.52],[-122.57,45.53],[-122.52,45.50],[-122.49,45.48],[-122.64,45.49],[-122.63,45.52],[-122.63,45.52]],
          [[-83,35],[-74,35],[-74,41],[-83,41],[-83,35]]
        ],
        "spatialReference": {
          "wkid":4326
        }
      };

      var output = Terraformer.ArcGIS.parse(input);

      expect(output.coordinates).toEqual([[ [-122.63,45.52],[-122.57,45.53],[-122.52,45.50],[-122.49,45.48],[-122.64,45.49],[-122.63,45.52],[-122.63,45.52] ],[ [-83,35],[-74,35],[-74,41],[-83,41],[-83,35] ]]);
      expect(output).toBeInstanceOfClass(Terraformer.MultiPolygon);
    });
  });

});