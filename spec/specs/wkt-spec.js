if(typeof module === "object"){
 var Terraformer = require("../../dist/node/terraformer.js");
 Terraformer.WKT = require("../../dist/node/Parsers/WKT/index.js");
}

describe("WKT Parser", function() {

  it("should parse a POINT", function(){
    var input = "POINT (30 10)";
    var output = new Terraformer.WKT.parse(input);
    expect(output.coordinates).toEqual([30,10]);
    expect(output).toBeInstanceOfClass(Terraformer.Point);
    expect(output.type).toEqual("Point");
  });

  it("should parse a LINESTRING", function(){
    var input = "LINESTRING (30 10, 10 30, 40 40)";
    var output = new Terraformer.WKT.parse(input);
    expect(output.coordinates).toEqual([ [30,10], [10,30], [40,40] ]);
    expect(output).toBeInstanceOfClass(Terraformer.LineString);
    expect(output.type).toEqual("LineString");
  });

  it("should parse a POLYGON", function(){
    var input = "POLYGON ((30 10, 10 20, 20 40, 40 40, 30 10))";
    var output = new Terraformer.WKT.parse(input);
    expect(output.coordinates).toEqual([ [ [30, 10], [10, 20], [20, 40], [40, 40], [30, 10] ] ]);
    expect(output).toBeInstanceOfClass(Terraformer.Polygon);
    expect(output.type).toEqual("Polygon");
  });

  it("should parse a POLYGON with a hole", function(){
    var input = "POLYGON ((35 10, 10 20, 15 40, 45 45, 35 10),(20 30, 35 35, 30 20, 20 30))";
    var output = new Terraformer.WKT.parse(input);
    expect(output.coordinates).toEqual([
      [ [35, 10],[10, 20],[15, 40],[45, 45],[35, 10] ],
      [ [20, 30],[35, 35],[30, 20],[20, 30] ]
    ]);
    expect(output).toBeInstanceOfClass(Terraformer.Polygon);
    expect(output.type).toEqual("Polygon");
  });

  it("should parse a MULTIPOINT", function(){
    var input = "MULTIPOINT ((10 40), (40 30), (20 20), (30 10))";
    var output = new Terraformer.WKT.parse(input);
    expect(output.coordinates).toEqual([ [10, 40],[40, 30], [20,20], [30,10] ]);
    expect(output).toBeInstanceOfClass(Terraformer.MultiPoint);
    expect(output.type).toEqual("MultiPoint");
  });

  it("should parse a MULTIPOINT with alternate syntax", function(){
    var input = "MULTIPOINT (10 40, 40 30, 20 20, 30 10)";
    var output = new Terraformer.WKT.parse(input);
    expect(output.coordinates).toEqual([ [10, 40],[40, 30], [20,20], [30,10] ]);
    expect(output).toBeInstanceOfClass(Terraformer.MultiPoint);
    expect(output.type).toEqual("MultiPoint");
  });

  it("should parse a MULTILINESTRING with alternate syntax", function(){
    var input = "MULTILINESTRING ((10 10, 20 20, 10 40),(40 40, 30 30, 40 20, 30 10))";
    var output = new Terraformer.WKT.parse(input);
    expect(output.coordinates).toEqual([
      [ [10,10],[20,20],[10,40] ],
      [ [40,40],[30,30],[40,20],[30,10] ]
    ]);
    expect(output).toBeInstanceOfClass(Terraformer.MultiLineString);
    expect(output.type).toEqual("MultiLineString");
  });

  it("should parse a MULTIPOLYGON", function(){
    var input = "MULTIPOLYGON (((30 20, 10 40, 45 40, 30 20)),((15 5, 40 10, 10 20, 5 10, 15 5)))";
    var output = new Terraformer.WKT.parse(input);
    expect(output.coordinates).toEqual([
      [
        [ [30,20],[10,40],[45,40],[30,20] ]
      ],
      [
        [ [15,5],[40,10],[10,20],[5,10],[15,5] ]
      ]
    ]);
    expect(output).toBeInstanceOfClass(Terraformer.MultiPolygon);
    expect(output.type).toEqual("MultiPolygon");
  });

  it("should parse a MULTIPOLYGON with a hole", function(){
    var input = "MULTIPOLYGON (((40 40, 20 45, 45 30, 40 40)),((20 35, 45 20, 30 5, 10 10, 10 30, 20 35),(30 20, 20 25, 20 15, 30 20)))";
    var output = new Terraformer.WKT.parse(input);
    expect(output.coordinates).toEqual([
      [
        [ [40,40], [20,45], [45,30], [40,40] ]
      ],
      [
        [ [20,35],[45,20],[30,5] ,[10,10],[10,30],[20,35] ],
        [ [30,20], [20,25], [20,15],[30,20] ]
      ]
    ]);
    expect(output).toBeInstanceOfClass(Terraformer.MultiPolygon);
    expect(output.type).toEqual("MultiPolygon");
  });

});