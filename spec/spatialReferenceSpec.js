if(typeof module === "object"){
  var Terraformer = require("../terraformer.js");
}

describe("Spatial Reference Converters", function(){
  it("should convert a GeoJSON Point to Web Mercator", function(){
    var input = {
      "type": "Point",
      "coordinates": [-122, 45]
    };
    var expectedOutput = {
      "type": "Point",
      "coordinates": [-13580977.876779145, 5621521.486191948],
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

  it("should convert a GeoJSON MultiPoint to Web Mercator", function(){
    var input = {
      "type": "MultiPoint",
      "coordinates": [ [-122, 45], [100,0], [45, 62] ]
    };
    var expectedOutput = {
      "type": "MultiPoint",
      "coordinates": [ [-13580977.876779145,5621521.486191948],[11131949.079327168,0],[5009377.085697226,8859142.800565446] ],
      "crs": {
        "type": "link",
        "properties": {
          "href": "http://spatialreference.org/ref/sr-org/6928/ogcwkt/",
          "type": "ogcwkt"
        }
      }
    };
    var output = Terraformer.toMercator(input);
    // expect(output).toEqual(expectedOutput);
    expect(output.type).toEqual(expectedOutput.type);
    expect(output.crs).toEqual(expectedOutput.crs);
    expect(output.coordinates[0][0]).toBeCloseTo(expectedOutput.coordinates[0][0], 9);
    expect(output.coordinates[0][1]).toBeCloseTo(expectedOutput.coordinates[0][1], 9);
    expect(output.coordinates[1][0]).toBeCloseTo(expectedOutput.coordinates[1][0], 9);
    expect(output.coordinates[1][1]).toBeCloseTo(expectedOutput.coordinates[1][1], 9);
  });

  it("should convert a GeoJSON LineString to Web Mercator", function(){
    var input = {
      "type": "LineString",
      "coordinates": [ [-122, 45], [100,0], [45, 62] ]
    };
    var expectedOutput = {
      "type": "LineString",
      "coordinates": [ [-13580977.876779145,5621521.486191948],[11131949.079327168,0],[5009377.085697226,8859142.800565446] ],
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

  it("should convert a GeoJSON MultiLineString to Web Mercator", function(){
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
    var output = Terraformer.toMercator(input);
    expect(output).toEqual(expectedOutput);
  });

  it("should convert a GeoJSON Polygon to Web Mercator", function(){
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
    var output = Terraformer.toMercator(input);
    expect(output).toEqual(expectedOutput);
  });

  it("should convert a GeoJSON MultiPolygon to Web Mercator", function(){
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
          [ [11354588.060913712,222684.20850554065],[11465907.551706985,222684.20850554065],[11465907.551706985,334111.1714019535],[11354588.060913712,334111.1714019535],[11354588.060913712,222684.20850554065] ]
        ],
        [
          [ [11131949.079327168,0],[11243268.57012044,0],[11243268.57012044,111325.1428663833],[11131949.079327168,111325.1428663833],[11131949.079327168,0] ]
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
    var output = Terraformer.toMercator(input);
    expect(output.type).toEqual(expectedOutput.type);
    expect(output.crs).toEqual(expectedOutput.crs);
    for (var i=0; i < output.coordinates[0].length; i++) {
      var segments = output.coordinates[0][i];
      for (var j=0; j < segments.length; j++) {
        expect(segments[j][0]).toBeCloseTo(expectedOutput.coordinates[0][i][j][0], 9);
        expect(segments[j][1]).toBeCloseTo(expectedOutput.coordinates[0][i][j][1], 9);
      }
    }
  });

  it("should convert a GeoJSON Feature to Web Mercator", function(){
    var input = {
      "type": "Feature",
      "id": "foo",
      "geometry":{
        "type": "Point",
        "coordinates": [-122, 45]
      },
      "properties": {
        "bar": "baz"
      }
    };
    var expectedOutput = {
      "type": "Feature",
      "id": "foo",
      "geometry":{
        "type": "Point",
        "coordinates": [-13580977.876779145, 5621521.486191948]
      },
      "properties": {
        "bar": "baz"
      },
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

  it("should convert a GeoJSON Feature Collection to Web Mercator", function(){
    var input = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "id": "foo",
          "geometry":{
            "type": "Point",
            "coordinates": [-122, 45]
          },
          "properties": {
            "bar": "baz"
          }
        },{
          "type": "Feature",
          "id": "bar",
          "geometry":{
            "type": "Point",
            "coordinates": [-122, 45]
          },
          "properties": {
            "bar": "baz"
          }
        }
      ]
    };
    var expectedOutput = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "id": "foo",
          "geometry":{
            "type": "Point",
            "coordinates": [-13580977.876779145, 5621521.486191948]
          },
          "properties": {
            "bar": "baz"
          }
        },{
          "type": "Feature",
          "id": "bar",
          "geometry":{
            "type": "Point",
            "coordinates": [-13580977.876779145, 5621521.486191948]
          },
          "properties": {
            "bar": "baz"
          }
        }
      ],
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

  it("should convert a GeoJSON Geometry Collection to Web Mercator", function(){
    var input = {
      "type": "GeometryCollection",
      "geometries": [
        {
          "type": "Point",
          "coordinates": [-122, 45]
        },{
          "type": "Point",
          "coordinates": [-122, 45]
        }
      ]
    };
    var expectedOutput = {
      "type": "GeometryCollection",
      "geometries": [
        {
          "type": "Point",
          "coordinates": [-13580977.876779145, 5621521.486191948]
        },{
          "type": "Point",
          "coordinates": [-13580977.876779145, 5621521.486191948]
        }
      ],
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

  it("should convert a GeoJSON Point to Geographic coordinates", function(){
    var input = {
      "type": "Point",
      "coordinates": [-13656274.38035172, 5703203.67194997]
    };
    var expectedOutput = {
      "type": "Point",
      "coordinates": [-122.67639999999798, 45.51649999999925]
    };
    var output = Terraformer.toGeographic(input);
    expect(output).toEqual(expectedOutput);
  });

  it("should convert a GeoJSON MultiPoint to Geographic coordinates", function(){
    var input = {
      "type": "MultiPoint",
      "coordinates": [ [-13656274.380351715,5703203.671949966],[11131949.079327168,0],[-13619241.057432571,6261718.09354067] ]
    };
    var expectedOutput = {
      "type": "MultiPoint",
      "coordinates": [ [-122.67639999999793,45.51649999999922],[99.99999999999831,0],[-122.34372399999793,48.92247999999917] ]
    };
    var output = Terraformer.toGeographic(input);

    expect(expectedOutput.coordinates[0][0]).toBeCloseTo(-122.6764000000, 10);
    expect(expectedOutput.coordinates[0][1]).toBeCloseTo(45.5165000000, 10);
    expect(expectedOutput.coordinates[1][0]).toBeCloseTo(100.0000000000, 10);
    expect(expectedOutput.coordinates[1][1]).toBeCloseTo(0.0000000000, 10);
    expect(expectedOutput.coordinates[2][0]).toBeCloseTo(-122.3437240000, 10);
    expect(expectedOutput.coordinates[2][1]).toBeCloseTo(48.9224800000, 10);
  });

  it("should convert a GeoJSON LineString to Geographic coordinates", function(){
    var input = {
      "type": "LineString",
      "coordinates": [ [743579.411158182,6075718.008992066],[-7279251.077653782,6869641.046935855],[-5831228.013819427,5242073.5675988225] ]
    };
    var expectedOutput = {
      "type": "LineString",
      "coordinates": [ [6.679687499999886,47.8124999999992],[-65.3906249999989,52.38281249999912],[-52.38281249999912,42.539062499999275] ]
    };
    var output = Terraformer.toGeographic(input);

    expect(expectedOutput.coordinates[0][0]).toBeCloseTo(6.6796875000, 10);
    expect(expectedOutput.coordinates[0][1]).toBeCloseTo(47.8125000000, 10);
    expect(expectedOutput.coordinates[1][0]).toBeCloseTo(-65.3906250000, 10);
    expect(expectedOutput.coordinates[1][1]).toBeCloseTo(52.3828125000, 10);
    expect(expectedOutput.coordinates[2][0]).toBeCloseTo(-52.3828125000, 10);
    expect(expectedOutput.coordinates[2][1]).toBeCloseTo(42.5390625000, 10);
  });

  it("should convert a GeoJSON MultiLineString to Geographic coordinates", function(){
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
      ]
    };
    var output = Terraformer.toGeographic(input);
    expect(output).toEqual(expectedOutput);
  });

  it("should convert a GeoJSON Polygon to Geographic coordinates", function(){
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
      ]
    };
    var output = Terraformer.toGeographic(input);
    expect(output).toEqual(expectedOutput);
  });

  it("should convert a GeoJSON MultiPolygon to Geographic coordinates", function(){
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
      ]
    };
    var output = Terraformer.toGeographic(input);
    expect(output).toEqual(expectedOutput);
  });

  it("should convert a GeoJSON Feature to Geographic coordinates", function(){
    var input = {
      "type": "Feature",
      "id": "foo",
      "geometry":{
        "type": "Point",
        "coordinates": [-13656274.380351715, 5703203.671949966]
      },
      "properties": {
        "bar": "baz"
      }
    };
    var expectedOutput = {
      "type": "Feature",
      "id": "foo",
      "geometry":{
        "type": "Point",
        "coordinates": [-122.67639999999793, 45.51649999999923]
      },
      "properties": {
        "bar": "baz"
      }
    };
    var output = Terraformer.toGeographic(input);

    expect(expectedOutput.geometry.coordinates[0]).toBeCloseTo(-122.6764000000, 10);
    expect(expectedOutput.geometry.coordinates[1]).toBeCloseTo(45.5165000000, 10);
  });

  it("should convert a GeoJSON Feature Collection to Geographic coordinates", function(){
    var input = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "id": "foo",
          "geometry":{
            "type": "Point",
            "coordinates": [-13656274.380351715, 5703203.671949966]
          },
          "properties": {
            "bar": "baz"
          }
        },{
          "type": "Feature",
          "id": "bar",
          "geometry":{
            "type": "Point",
            "coordinates": [-13656274.380351715, 5703203.671949966]
          },
          "properties": {
            "bar": "baz"
          }
        }
      ]
    };
    var expectedOutput = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "id": "foo",
          "geometry":{
            "type": "Point",
            "coordinates": [-122.67639999999793, 45.51649999999923]
          },
          "properties": {
            "bar": "baz"
          }
        },{
          "type": "Feature",
          "id": "bar",
          "geometry":{
            "type": "Point",
            "coordinates": [-122.67639999999793, 45.51649999999923]
          },
          "properties": {
            "bar": "baz"
          }
        }
      ]
    };
    var output = Terraformer.toGeographic(input);

    expect(expectedOutput.features[0].geometry.coordinates[0]).toBeCloseTo(-122.6764000000, 10);
    expect(expectedOutput.features[0].geometry.coordinates[1]).toBeCloseTo(45.5165000000, 10);

    expect(expectedOutput.features[1].geometry.coordinates[0]).toBeCloseTo(-122.6764000000, 10);
    expect(expectedOutput.features[1].geometry.coordinates[1]).toBeCloseTo(45.5165000000, 10);
  });

  it("should convert a GeoJSON Geometry Collection to Geographic coordinates", function(){
    var input = {
      "type": "GeometryCollection",
      "geometries": [
        {
          "type": "Point",
          "coordinates": [-13656274.380351715, 5703203.671949966]
        },{
          "type": "Point",
          "coordinates": [-13656274.380351715, 5703203.671949966]
        }
      ]
    };
    var expectedOutput = {
      "type": "GeometryCollection",
      "geometries": [
        {
          "type": "Point",
          "coordinates": [-122.67639999999793, 45.51649999999923]
        },{
          "type": "Point",
          "coordinates": [-122.67639999999793, 45.51649999999923]
        }
      ]
    };
    var output = Terraformer.toGeographic(input);

    expect(expectedOutput.geometries[0].coordinates[0]).toBeCloseTo(-122.6764000000, 10);
    expect(expectedOutput.geometries[0].coordinates[1]).toBeCloseTo(45.5165000000, 10);

    expect(expectedOutput.geometries[1].coordinates[0]).toBeCloseTo(-122.6764000000, 10);
    expect(expectedOutput.geometries[1].coordinates[1]).toBeCloseTo(45.5165000000, 10);
  });
});
