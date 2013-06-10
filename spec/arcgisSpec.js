if(typeof module === "object"){
  var Terraformer = require("../dist/node/terraformer.js");
  Terraformer.ArcGIS = require("../dist/node/Parsers/ArcGIS/index.js");
}

beforeEach(function() {
  this.addMatchers({
    toBeInstanceOfClass: function(classRef){
      return this.actual instanceof classRef;
    }
  });
});


describe("ArcGIS Tools", function(){

  it("should convert a GeoJSON Point to an ArcGIS Point", function() {
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

  it("should convert a GeoJSON LineString to an ArcGIS Polyline", function() {
    var input = {
      "type": "LineString",
      "coordinates": [ [21.4453125,-14.0625],[33.3984375,-20.7421875],[38.3203125,-24.609375] ]
    };

    var output = Terraformer.ArcGIS.convert(input);

    expect(output).toEqual({
      "paths":[
        [ [21.4453125,-14.0625],[33.3984375,-20.7421875],[38.3203125,-24.609375] ]
      ],
      "spatialReference":{
        "wkid":4326
      }
    });
  });

  it("should convert a GeoJSON Polygon to an ArcGIS Polygon", function() {
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

  it("should convert a GeoJSON Polygon w/ a hole to an ArcGIS Polygon w/ 2 rings", function() {
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

  it("should convert a GeoJSON MultiPoint to an ArcGIS Multipoint", function() {
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

  it("should convert a GeoJSON MultiLineString to an ArcGIS Polyline", function() {
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

  it("should convert a GeoJSON MultiPolygon to an ArcGIS Polygon", function() {
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

  it("should convert a GeoJSON MultiPolygon w/ holes to an ArcGIS Polygon", function() {
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

  it("should convert a GeoJSON Feature into an ArcGIS Graphic JSON", function(){
    var input = {
      "type":"Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
        ]
      },
      "properties": {
        "foo":"bar"
      }
    };

    var output = Terraformer.ArcGIS.convert(input);

    expect(output).toEqual({
      "geometry":{
        "rings":[
          [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
        ],
        "spatialReference":{
          "wkid":4326
        }
      },
      "attributes": {
        "foo":"bar"
      }
    });
  });

  it("should convert a GeoJSON FeatureCollection into an array of ArcGIS Feature JSON", function(){
    var input = {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [102.0, 0.5]
        },
        "properties": {
          "prop0": "value0"
        }
      }, {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [102.0, 0.0],[103.0, 1.0],[104.0, 0.0],[105.0, 1.0]
          ]
        },
        "properties": {
          "prop0": "value0"
        }
      }, {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [[100.0, 0.0],[101.0, 0.0],[101.0, 1.0],[100.0, 1.0],[100.0, 0.0]]
          ]
        },
        "properties": {
          "prop0": "value0"
        }
      }]
    };

    var output = Terraformer.ArcGIS.convert(input);

    expect(output).toEqual([{
      "geometry": {
        "x": 102,
        "y": 0.5,
        "spatialReference": {
          "wkid": 4326
        }
      },
      "attributes": {
        "prop0": "value0"
      }
    }, {
      "geometry": {
        "paths": [
          [[102, 0],[103, 1],[104, 0],[105, 1]]
        ],
        "spatialReference": {
          "wkid": 4326
        }
      },
      "attributes": {
        "prop0": "value0"
      }
    }, {
      "geometry": {
        "rings": [
          [[100, 0],[101, 0],[101, 1],[100, 1],[100, 0]]
        ],
        "spatialReference": {
          "wkid": 4326
        }
      },
      "attributes": {
        "prop0": "value0"
      }
    }]);
  });

  it("should convert a GeoJSON GeometryCollection into an array of ArcGIS Geometries", function(){
    var input = {
      "type" : "GeometryCollection",
      "geometries" : [{
        "type" : "Polygon",
        "coordinates" : [[[-95, 43], [-95, 50], [-90, 50], [-91, 42], [-95, 43]]]
      }, {
        "type" : "LineString",
        "coordinates" : [[-89, 42], [-89, 50], [-80, 50], [-80, 42]]
      }, {
        "type" : "Point",
        "coordinates" : [-94, 46]
      }]
    };

    var output = Terraformer.ArcGIS.convert(input);

    expect(output).toEqual([{
      "rings": [
        [[-95, 43],[-95, 50],[-90, 50],[-91, 42],[-95, 43]]
      ],
      "spatialReference": {
        "wkid": 4326
      }
    }, {
      "paths": [
        [[-89, 42],[-89, 50],[-80, 50],[-80, 42]]
      ],
      "spatialReference": {
        "wkid": 4326
      }
    }, {
      "x": -94,"y": 46,
      "spatialReference": {
        "wkid": 4326
      }
    }]);
  });

  it("should parse an ArcGIS Point in a Terraformer GeoJSON Point", function() {
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

  it("should parse an ArcGIS Polyline in a Terraformer GeoJSON LineString", function() {
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

  it("should parse an ArcGIS Polygon in a Terraformer GeoJSON Polygon", function() {
    var input = {
      "rings": [
        [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
      ],
      "spatialReference": {
        "wkid": 4326
      }
    };

    var output = Terraformer.ArcGIS.parse(input);

    expect(output.coordinates).toEqual([[[ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]]]);
    expect(output).toBeInstanceOfClass(Terraformer.MultiPolygon);
  });

  it("should parse an ArcGIS Multipoint in a Terraformer GeoJSON MultiPoint", function() {
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

  it("should parse an ArcGIS Polyline in a Terraformer GeoJSON MultiLineString", function() {
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

  it("should parse an ArcGIS Polygon in a Terraformer GeoJSON MultiPolygon", function() {
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

    expect(output.coordinates).toEqual([
      [
        [ [-122.63,45.52],[-122.57,45.53],[-122.52,45.5],[-122.49,45.48],[-122.64,45.49],[-122.63,45.52],[-122.63,45.52] ]
      ],
      [
        [ [-83,35],[-74,35],[-74,41],[-83,41],[-83,35] ]
      ]
    ]);
    expect(output.type).toEqual("MultiPolygon");
  });

  it("should parse an ArcGIS MultiPolygon with holes in web mercator to a GeoJSON MultiPolygon", function(){
    var input = {
      "rings":[
        [[-11214840,4858704],[-10520181,4853812],[-10510397,4149368],[-11219732,4144476],[-11214840,4858704]],
        [[-11097433,4770648],[-10916430,4770648],[-10916430,4609213],[-10984918,4560294],[-11097433,4614105],[-11097433,4770648]],
        [[-10779455,4472238],[-10833267,4296127],[-10750103,4242315],[-10622912,4349939],[-10779455,4472238]],
        [[-11298004,4614105],[-11293112,4310803],[-11571954,4305911],[-11542602,4584753],[-11298004,4614105]]
      ],
      "spatialReference":{"wkid":102100}
    };

    var output = Terraformer.ArcGIS.parse(input);
    expect(output.coordinates).toEqual([[[[-100.74462180954974,39.95017165502381],[-94.50439384003792,39.91647453608879],[-94.41650267263967,34.89313438177967],[-100.78856739324887,34.857081409967705],[-100.74462180954974,39.95017165502381]],[[-99.68993678392353,39.34108843344889],[-98.06395917020868,39.34108843344889],[-98.06395917020868,38.210554846669694],[-98.67919734199646,37.86444431771113],[-99.68993678392353,38.245076587858854],[-99.68993678392353,39.34108843344889]],[[-96.83349180978595,37.237320275075135],[-97.31689323047635,35.96733028298852],[-96.5698183075912,35.57512048069255],[-95.42724211456674,36.357601429255965],[-96.83349180978595,37.237320275075135]],[[-101.4916967324349,38.245076587858854],[-101.44775114873578,36.073960493943744],[-103.95263145328033,36.03843312329154],[-103.68895795108557,38.037700507674394],[-101.4916967324349,38.245076587858854]]]]);
    expect(output.type).toEqual("MultiPolygon");
  });

  it("should parse an ArcGIS Graphic into a Terraformer Feature", function(){
    var input = {
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
    };

    output = Terraformer.ArcGIS.parse(input);

    expect(output.geometry.coordinates).toEqual([[[ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]]]);
    expect(output.geometry.type).toEqual("MultiPolygon");
    expect(output).toBeInstanceOfClass(Terraformer.Feature);
  });

  it("should convert to WGS84/4326 while parsing", function(){
    var input = {
      "x": -13580977.876779145,
      "y": 5621521.486191948,
      "spatialReference": {
        "wkid": 102100
      }
    };
    var expectedOutput = {
      "type": "Point",
      "coordinates": [-122, 45]
    };
    var output = Terraformer.ArcGIS.parse(input);
    expect(output.coordinates).toEqual([-121.99999999999794, 44.99999999999924]);
  });

});
