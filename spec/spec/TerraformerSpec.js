describe("geojson to arcgis conversions", function(){
  it("should convert a point", function() {
    var input = {
      "type": "Point",
      "coordinates": [-58.7109375,47.4609375]
    };

    output = Terraformer.toArcGIS(input);

    expect(output).toEqual({
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

    output = Terraformer.toArcGIS(input);

    expect(output).toEqual({
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

    output = Terraformer.toArcGIS(input);

    expect(output).toEqual({
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

    output = Terraformer.toArcGIS(input);

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

  it("should convert a multipoint", function() {
    var input = {
      "type": "MultiPoint",
      "coordinates": [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625] ]
    };

    output = Terraformer.toArcGIS(input);
    
    expect(output).toEqual({
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

    output = Terraformer.toArcGIS(input);

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

    output = Terraformer.toArcGIS(input);

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

    output = Terraformer.toArcGIS(input);

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

describe("arcgis to geojson conversions", function(){
  it("should convert a point", function() {
    var input = {
      "x": -66.796875,
      "y": 20.0390625,
      "spatialReference": {
        "wkid": 4326
      }
    };

    output = Terraformer.toGeoJSON(input);

    expect(output).toEqual({
      "type": "Point",
      "coordinates": [-66.796875,20.0390625]
    });
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

    output = Terraformer.toGeoJSON(input);

    expect(output).toEqual({
      "type": "LineString",
      "coordinates": [ [6.6796875,47.8125],[-65.390625,52.3828125],[-52.3828125,42.5390625] ]
    });
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

    output = Terraformer.toGeoJSON(input);

    expect(output).toEqual({
      "type": "Polygon",
      "coordinates": [
        [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
      ]
    });
  });

  it("should convert a multipoint", function() {
    var input = {
      "points":[ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625] ],
      "spatialReference":{
        "wkid":4326
      }
    };

    output = Terraformer.toGeoJSON(input);

    expect(output).toEqual({
      "type": "MultiPoint",
      "coordinates": [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625] ]
    });
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
    var input = {
      "rings":[
        [[-122.63,45.52],[-122.57,45.53],[-122.52,45.50],[-122.49,45.48],[-122.64,45.49],[-122.63,45.52],[-122.63,45.52]],
        [[-83,35],[-74,35],[-74,41],[-83,41],[-83,35]]
      ],
      "spatialReference": {
        "wkid":4326
      }
    };

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

describe("to mercator conversions", function(){
  it("should convert a Point to mercator", function(){
    var input = { 
      "type": "Point",
      "coordinates": [-122.6764, 45.5165]
    };
    var expectedOutput = { 
      "type": "Point", 
      "coordinates": [-13656274.380351715, 5703203.671949966],
      "crs": {
        "type": "link",
        "properties": {
          "href": "http://spatialreference.org/ref/sr-org/6928/ogcwkt/",
          "type": "ogcwkt"
        }
      }
    };
    var output = Terraformer.toMercator(input);
    expect(output).toEqual(expectedOutput);
  });

  it("should convert a MultiPoint to mercator", function(){
    var input = { 
      "type": "MultiPoint",
      "coordinates": [ [-122.6764, 45.5165], [100,0], [-122.343724,48.92248] ]
    };
    var expectedOutput = { 
      "type": "MultiPoint", 
      "coordinates": [ [-13656274.380351715,5703203.671949966],[11131949.079327168,0],[-13619241.057432571,6261718.09354067] ],
      "crs": {
        "type": "link",
        "properties": {
          "href": "http://spatialreference.org/ref/sr-org/6928/ogcwkt/",
          "type": "ogcwkt"
        }
      }
    };
    var output = Terraformer.toMercator(input);
    expect(output).toEqual(expectedOutput);
  });

  it("should convert a LineString to mercator", function(){
    var input = {
      "type": "LineString",
      "coordinates": [ [6.6796875,47.8125],[-65.390625,52.3828125],[-52.3828125,42.5390625] ]
    };
    var expectedOutput = { 
      "type": "LineString", 
      "coordinates": [ [743579.411158182,6075718.008992066],[-7279251.077653782,6869641.046935855],[-5831228.013819427,5242073.5675988225] ],
      "crs": {
        "type": "link",
        "properties": {
          "href": "http://spatialreference.org/ref/sr-org/6928/ogcwkt/",
          "type": "ogcwkt"
        }
      }
    };
    var output = Terraformer.toMercator(input)
    expect(output).toEqual(expectedOutput)
  });

  it("should convert a MultiLineString to mercator", function(){
    var input = {
      "type": "MultiLineString",
      "coordinates": [
        [ [41.8359375,71.015625],[56.953125,33.75] ],
        [ [21.796875,36.5625],[47.8359375,71.015625] ]
      ]
    };
    var expectedOutput = { 
      "type": "MultiLineString", 
      "coordinates": [
        [ [4657155.25935914,11407616.835043576],[6339992.874085551,3995282.329624161] ],
        [ [2426417.025884594,4378299.115616046],[5325072.20411877,11407616.835043576] ]
      ],
      "crs": {
        "type": "link",
        "properties": {
          "href": "http://spatialreference.org/ref/sr-org/6928/ogcwkt/",
          "type": "ogcwkt"
        }
      }
    };
    var output = Terraformer.toMercator(input)
    expect(output).toEqual(expectedOutput)
  });

  it("should convert a Polygon to mercator", function(){
    var input = {
      "type": "Polygon",
      "coordinates": [ 
        [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ] 
      ]
    };
    var expectedOutput = { 
      "type": "Polygon", 
      "coordinates": [
        [ [4657155.25935914,11407616.835043576],[6339992.874085551,3995282.329624161],[2426417.025884594,4378299.115616046],[4657155.25935914,11407616.835043576] ]
      ],
      "crs": {
        "type": "link",
        "properties": {
          "href": "http://spatialreference.org/ref/sr-org/6928/ogcwkt/",
          "type": "ogcwkt"
        }
      }
    };
    var output = Terraformer.toMercator(input)
    expect(output).toEqual(expectedOutput)
  });

  it("should convert a MultiPolygon to mercator", function(){
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

    var expectedOutput = { 
      "type": "MultiPolygon", 
      "coordinates": [
        [
          [ [11354588.060913712,222684.2085055407],[11465907.551706985,222684.2085055407],[11465907.551706985,334111.1714019535],[11354588.060913712,334111.1714019535],[11354588.060913712,222684.2085055407] ],
        ],
        [
          [ [11131949.079327168,0],[11243268.57012044,0],[11243268.57012044,111325.14286638329],[11131949.079327168,111325.14286638329],[11131949.079327168,0] ]
        ]
      ],
      "crs": {
        "type": "link",
        "properties": {
          "href": "http://spatialreference.org/ref/sr-org/6928/ogcwkt/",
          "type": "ogcwkt"
        }
      }
    };
    var output = Terraformer.toMercator(input)
    expect(output).toEqual(expectedOutput)
  });
});

describe("to geographic conversions", function(){
  it("should convert a Point to geographic", function(){
    var input = { 
      "type": "Point",
      "coordinates": [-13656274.380351715, 5703203.671949966]
    };
    var expectedOutput = { 
      "type": "Point", 
      "coordinates": [-122.67639999999793, 45.516499999999226],
      "crs": {
        "type": "link",
        "properties": {
          "href": "http://spatialreference.org/ref/epsg/4326/ogcwkt/",
          "type": "ogcwkt"
        }
      }
    };
    var output = Terraformer.toGeographic(input);
    expect(output).toEqual(expectedOutput);
  });

  it("should convert a MultiPoint to geographic", function(){
    var input = { 
      "type": "MultiPoint",
      "coordinates": [ [-13656274.380351715,5703203.671949966],[11131949.079327168,0],[-13619241.057432571,6261718.09354067] ]
    };
    var expectedOutput = { 
      "type": "MultiPoint", 
      "coordinates": [ [-122.67639999999793,45.516499999999226],[99.99999999999831,0],[-122.34372399999793,48.92247999999917] ],
      "crs": {
        "type": "link",
        "properties": {
          "href": "http://spatialreference.org/ref/epsg/4326/ogcwkt/",
          "type": "ogcwkt"
        }
      }
    };
    var output = Terraformer.toGeographic(input);
    expect(output).toEqual(expectedOutput);
  });

  it("should convert a LineString to geographic", function(){
    var input = {
      "type": "LineString",
      "coordinates": [ [743579.411158182,6075718.008992066],[-7279251.077653782,6869641.046935855],[-5831228.013819427,5242073.5675988225] ]
    };
    var expectedOutput = { 
      "type": "LineString", 
      "coordinates": [ [6.679687499999886,47.8124999999992],[-65.3906249999989,52.38281249999911],[-52.38281249999912,42.539062499999275] ],
      "crs": {
        "type": "link",
        "properties": {
          "href": "http://spatialreference.org/ref/epsg/4326/ogcwkt/",
          "type": "ogcwkt"
        }
      }
    };
    var output = Terraformer.toGeographic(input)
    expect(output).toEqual(expectedOutput)
  });

  it("should convert a MultiLineString to geographic", function(){
    var input = {
      "type": "MultiLineString",
      "coordinates": [
        [ [41.8359375,71.015625],[56.953125,33.75] ],
        [ [21.796875,36.5625],[47.8359375,71.015625] ]
      ]
    };
    var expectedOutput = { 
      "type": "MultiLineString", 
      "coordinates": [
        [ [0.00037581862081719045,0.0006379442134689308],[0.0005116186266586962,0.00030318140838354136]],[[0.00019580465958542694,0.00032844652575519755],[0.0004297175378643617,0.0006379442134689308] ]
      ],
      "crs": {
        "type": "link",
        "properties": {
          "href": "http://spatialreference.org/ref/epsg/4326/ogcwkt/",
          "type": "ogcwkt"
        }
      }
    };
    var output = Terraformer.toGeographic(input)
    expect(output).toEqual(expectedOutput)
  });

  it("should convert a Polygon to geographic", function(){
    var input = {
      "type": "Polygon",
      "coordinates": [ 
        [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ] 
      ]
    };
    var expectedOutput = { 
      "type": "Polygon", 
      "coordinates": [
        [ [0.00037581862081719045,0.0006379442134689308],[0.0005116186266586962,0.00030318140838354136],[0.00019580465958542694,0.00032844652575519755],[0.00037581862081719045,0.0006379442134689308] ]
      ],
      "crs": {
        "type": "link",
        "properties": {
          "href": "http://spatialreference.org/ref/epsg/4326/ogcwkt/",
          "type": "ogcwkt"
        }
      }
    };
    var output = Terraformer.toGeographic(input)
    expect(output).toEqual(expectedOutput)
  });

  it("should convert a MultiPolygon to geographic", function(){
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
    
    var expectedOutput = { 
      "type": "MultiPolygon", 
      "coordinates": [
        [
            [ [0.000916281589801912,0.000017966305681987637],[0.0009252647426431071,0.000017966305681987637],[0.0009252647426431071,0.000026949458522981454],[0.000916281589801912,0.000026949458522981454],[0.000916281589801912,0.000017966305681987637] ]
        ],
        [
          [ [0.0008983152841195215,0],[0.0009072984369607167,0],[0.0009072984369607167,0.000008983152840993819],[0.0008983152841195215,0.000008983152840993819],[0.0008983152841195215,0] ]
        ]
      ],
      "crs": {
        "type": "link",
        "properties": {
          "href": "http://spatialreference.org/ref/epsg/4326/ogcwkt/",
          "type": "ogcwkt"
        }
      }
    };
    var output = Terraformer.toGeographic(input)
    expect(output).toEqual(expectedOutput)
  });
});