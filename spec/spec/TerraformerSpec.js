describe("geojson to arcgis conversions", function(){
  it("should convert a point", function() {
    var input = {
      "type": "Point",
      "coordinates": [-58.7109375,47.4609375]
    };

    output = Terraformer.toArcGIS(input, {
      spatialReference: new esri.SpatialReference(4326)
    });

    expect(output.toJson()).toEqual({
      "x":-58.7109375,
      "y":47.4609375,
      "spatialReference":{
        "wkid":4326
      }
    });
  });

  it("should convert a line", function() {
    var input = {
      "type": "LineString",
      "coordinates": [ [21.4453125,-14.0625],[33.3984375,-20.7421875],[38.3203125,-24.609375] ]
    };

    output = Terraformer.toArcGIS(input, {
      spatialReference: new esri.SpatialReference(4326)
    });

    expect(output.toJson()).toEqual({
      "paths":[
        [ [21.4453125,-14.0625],[33.3984375,-20.7421875],[38.3203125,-24.609375] ]
      ],
      "spatialReference":{
        "wkid":4326
      }
    });
  });

  it("should convert a polygon", function() {
    var input = {
      "type": "Polygon",
      "coordinates": [ 
        [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
      ]
    };

    output = Terraformer.toArcGIS(input, {
      spatialReference: new esri.SpatialReference(4326)
    });

    expect(output.toJson()).toEqual({
      "rings":[
        [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
      ],
      "spatialReference":{
        "wkid":4326
      }
    });
  });

  it("should convert a polygon with a hole", function() {
    var input = {
      "type": "Polygon",
      "coordinates": [
        [ [100.0,0.0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0] ],
        [ [100.2,0.2],[100.8,0.2],[100.8,0.8],[100.2,0.8],[100.2,0.2] ]
      ]
    };

    output = Terraformer.toArcGIS(input, {
      spatialReference: new esri.SpatialReference(4326)
    });

    expect(output.toJson()).toEqual({
      "rings": [
        [ [100.0,0.0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0] ],
        [ [100.2,0.2],[100.8,0.2],[100.8,0.8],[100.2,0.8],[100.2,0.2] ]
      ],
      "spatialReference":{
        "wkid":4326
      }
    });
  });

  it("should convert a multipoint", function() {
    var input = {
      "type": "MultiPoint",
      "coordinates": [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625] ]
    };

    output = Terraformer.toArcGIS(input, {
      spatialReference: new esri.SpatialReference(4326)
    });
    
    expect(output.toJson()).toEqual({
      "points":[ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625] ],
      "spatialReference":{
        "wkid":4326
      }
    });
  });

  it("should convert a multiline", function() {
    var input = {
      "type": "MultiLineString",
      "coordinates": [
        [ [41.8359375,71.015625],[56.953125,33.75] ],
        [ [21.796875,36.5625],[47.8359375,71.015625] ]
      ]
    };

    output = Terraformer.toArcGIS(input, {
      spatialReference: new esri.SpatialReference(4326)
    });

    expect(output.toJson()).toEqual({
      "paths":[
        [ [41.8359375,71.015625],[56.953125,33.75] ],
        [ [21.796875,36.5625],[47.8359375,71.015625] ]
      ],
      "spatialReference":{
        "wkid":4326
      }
    });
  });

  it("should convert a multipolygon", function() {
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

    output = Terraformer.toArcGIS(input, {
      spatialReference: new esri.SpatialReference(4326)
    });

    expect(output.toJson()).toEqual({
      "rings":[
        [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0] ],
        [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
      ],
      "spatialReference": {
        "wkid":4326
      }
    });
  });

  it("should convert a multipolygon with holes", function() {
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

    output = Terraformer.toArcGIS(input, {
      spatialReference: new esri.SpatialReference(4326)
    });

    expect(output.toJson()).toEqual({
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

describe("arcgis to geojson conversions", function(){
  it("should convert a point", function() {
    var input = new esri.geometry.Point({
      "x": -66.796875,
      "y": 20.0390625,
      "spatialReference": {
        "wkid": 4326
      }
    });

    output = Terraformer.toGeoJSON(input);

    expect(output).toEqual({
      "type": "Point",
      "coordinates": [-66.796875,20.0390625]
    });
  });

  it("should convert a line", function() {
    var input = new esri.geometry.Polyline({
      "paths": [
        [ [6.6796875,47.8125],[-65.390625,52.3828125],[-52.3828125,42.5390625] ]
      ],
      "spatialReference": {
        "wkid": 4326
      }
    });

    output = Terraformer.toGeoJSON(input);

    expect(output).toEqual({
      "type": "LineString",
      "coordinates": [ [6.6796875,47.8125],[-65.390625,52.3828125],[-52.3828125,42.5390625] ]
    });
  });

  it("should convert a polygon", function() {
    var input = new esri.geometry.Polygon({
      "rings": [
        [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
      ],
      "spatialReference": {
        "wkid": 4326
      }
    });

    output = Terraformer.toGeoJSON(input);

    expect(output).toEqual({
      "type": "Polygon",
      "coordinates": [
        [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
      ]
    });
  });

  it("should convert a multipoint", function() {
    var input = new esri.geometry.Multipoint({
      "points":[ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625] ],
      "spatialReference":{
        "wkid":4326
      }
    });

    output = Terraformer.toGeoJSON(input);

    expect(output).toEqual({
      "type": "MultiPoint",
      "coordinates": [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625] ]
    });
  });

  it("should convert a line with multiple segments", function() {
    var input = new esri.geometry.Polyline({
      "paths":[
        [ [41.8359375,71.015625],[56.953125,33.75] ],
        [ [21.796875,36.5625],[41.8359375,71.015625] ]
      ],
      "spatialReference":{
        "wkid":4326
      }
    });

    output = Terraformer.toGeoJSON(input);

    expect(output).toEqual({
      type: "MultiLineString",
      coordinates: [
        [ [41.8359375,71.015625],[56.953125,33.75] ],
        [ [21.796875,36.5625],[41.8359375,71.015625] ]
      ]
    });
  });

  it("should convert a polygon with multiple rings", function() {
    var input = new esri.geometry.Polygon({
      "rings":[
        [[-122.63,45.52],[-122.57,45.53],[-122.52,45.50],[-122.49,45.48],[-122.64,45.49],[-122.63,45.52],[-122.63,45.52]],
        [[-83,35],[-74,35],[-74,41],[-83,41],[-83,35]]
      ],
      "spatialReference": {
        "wkid":4326
      }
    });

    output = Terraformer.toGeoJSON(input);

    expect(output).toEqual({
      "type": "MultiPolygon",
      "coordinates": [
        [ [-122.63,45.52],[-122.57,45.53],[-122.52,45.50],[-122.49,45.48],[-122.64,45.49],[-122.63,45.52],[-122.63,45.52] ],
        [ [-83,35],[-74,35],[-74,41],[-83,41],[-83,35] ]
      ]
    });
  });
});

describe("converter helpers", function(){
  it("should iterate an array of coordinates", function(){
    input = [ [100.0, 0.0], [101.0, 1.0] ];

    output = iterateCoordinates(input, function(coordinate){
      return [coordinate[0]*2, coordinate[1]*2];
    });

    expect(output).toEqual([ [200.0, 0.0], [202.0, 2.0] ])
  });

  it("should iterate an array of nested coordinates", function(){
    input =[ 
      [ [100.0, 0.0], [101.0, 1.0] ],
      [ [200.0, 0.0], [202.0, 1.0] ],
    ];

    expectedOutput = [ 
      [ [200.0, 0.0], [202.0, 2.0] ],
      [ [400.0, 0.0], [404.0, 2.0] ],
    ];

    output = iterateCoordinates(input, function(coordinate){
      return [coordinate[0]*2, coordinate[1]*2];
    });

    expect(output).toEqual(expectedOutput);
  });
});

describe("to mercator conversions", function(){
  it("should convert a position to mercator", function(){
    input = [-122.6764, 45.5165]
    expectedOutput = [-13656274.380351715, 5703203.671949966];
    output = positionToMercator(input);
    expect(output).toEqual(expectedOutput);
  });

  it("should convert a point to mercator", function(){
    input = { "type": "Point", "coordinates": [-122.6764, 45.5165] }
    expectedOutput = { 
      "type": "Point", 
      "coordinates": [-13656274.380351715, 5703203.671949966],
      "crs": {
        "type": "link",
        "properties": {
          "href": "http://spatialreference.org/ref/sr-org/6928/ogcwkt/",
          "type": "ogcwkt"
        }
      }
    }
    output = pointToMercator(input);
    expect(output).toEqual(expectedOutput);
  });
});