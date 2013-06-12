if(typeof module === "object"){
  var Terraformer = require("../dist/node/terraformer.js");
  Terraformer.RTree = require("../dist/node/RTree/index.js").RTree;
}

describe("RTree", function(){
  it("should find 1 result within an rtree with 1 entry that contains the request", function(){
    var tree = new Terraformer.RTree();
    var spy = jasmine.createSpy();
    tree.insert({ x: 10, y: 10, w: 10, h: 10 }, 'good');

    var dfd = tree.search({ x: 15, y: 15, w: 0, h: 0 }, spy);

    expect(spy).toHaveBeenCalledWith(null, ["good"]);
  });

  it("should find 1 result within an rtree with 10 entries that contains the request", function(){
    var tree = new Terraformer.RTree();
    var spy = jasmine.createSpy();
    tree.insert({ x: 10, y: 10, w: 10, h: 10 }, 'good');
    tree.insert({ x: 101, y: 101, w: 10, h: 10 }, 'bad1');
    tree.insert({ x: 102, y: 102, w: 10, h: 10 }, 'bad2');
    tree.insert({ x: 103, y: 103, w: 10, h: 10 }, 'bad3');
    tree.insert({ x: 104, y: 104, w: 10, h: 10 }, 'bad4');
    tree.insert({ x: 105, y: 105, w: 10, h: 10 }, 'bad5');
    tree.insert({ x: 106, y: 106, w: 10, h: 10 }, 'bad6');
    tree.insert({ x: 107, y: 107, w: 10, h: 10 }, 'bad7');
    tree.insert({ x: 108, y: 108, w: 10, h: 10 }, 'bad8');
    tree.insert({ x: 109, y: 109, w: 10, h: 10 }, 'bad9');
    tree.insert({ x: 110, y: 110, w: 10, h: 10 }, 'bad10');

    var dfd = tree.search({ x: 15, y: 15, w: 0, h: 0 }, spy);

    expect(spy).toHaveBeenCalledWith(null, [ 'good' ]);
  });

  it("should find no result within an rtree with 1 entry that doesn not contain the request", function(){
    var tree = new Terraformer.RTree();
    var spy = jasmine.createSpy();

    tree.insert({ x: 10, y: 10, w: 10, h: 10 }, 'bad');

    dfd = tree.search({ x: 1, y: 1, w: 0, h: 0 }, spy);

    expect(spy).toHaveBeenCalledWith(null, [ ]);
  });

  it("should find 1 result within an rtree with multiple entries where 1f entry contains the request", function(){
    var tree = new Terraformer.RTree();
    var spy = jasmine.createSpy();

    tree.insert({ x: 10, y: 10, w: 10, h: 10 }, 'good');
    tree.insert({ x: 100, y: 100, w: 10, h: 10 }, 'bad');

    var dfd = tree.search({ x: 15, y: 15, w: 0, h: 0 }, spy);

    expect(spy).toHaveBeenCalledWith(null, ["good"]);
  });

  it("should find no result within an rtree with multiple entries where no entry contains the request", function(){
    var tree = new Terraformer.RTree();
    var spy = jasmine.createSpy();

    tree.insert({ x: 10, y: 10, w: 10, h: 10 }, 'good');
    tree.insert({ x: 100, y: 100, w: 10, h: 10 }, 'bad');

    var dfd = tree.search({ x: 1, y: 1, w: 0, h: 0 }, spy);

    expect(spy).toHaveBeenCalledWith(null, []);
  });

  it("should not find a result if the containing entry was removed", function(){
    var tree = new Terraformer.RTree();
    var spy = jasmine.createSpy();

    tree.insert({ x: 10, y: 10, w: 10, h: 10 }, 'good');
    tree.insert({ x: 100, y: 100, w: 10, h: 10 }, 'bad');

    tree.remove({ x: 10, y: 10, w: 10, h: 10 });

    var dfd = tree.search({ x: 15, y: 15, w: 0, h: 0 }, spy);

    expect(spy).toHaveBeenCalledWith(null, []);
  });

  it("should properly serialize the rtree", function(){
    var tree = new Terraformer.RTree();
    var spy = jasmine.createSpy();

    tree.insert({ x: 10, y: 10, w: 10, h: 10 }, 'foo');
    tree.insert({ x: 100, y: 100, w: 10, h: 10 }, 'bar');

    var serializedTree = tree.serialize(spy);

    expect(spy).toHaveBeenCalledWith(null, {
      x: 10,
      y: 10,
      w: 100,
      h: 100,
      id: 'root',
      nodes: [
        {
          x: 10,
          y: 10,
          w: 10,
          h: 10,
          leaf: 'foo'
        },
        {
          x: 100,
          y: 100,
          w: 10,
          h: 10,
          leaf: 'bar'
        }
      ]
    });
  });

  it("should properly serialize a bigger rtree", function(){
    var tree = new Terraformer.RTree();
    var spy = jasmine.createSpy();
    tree.insert({ x: 10, y: 10, w: 10, h: 10 }, 'good');
    tree.insert({ x: 101, y: 101, w: 10, h: 10 }, 'bad1');
    tree.insert({ x: 102, y: 102, w: 10, h: 10 }, 'bad2');
    tree.insert({ x: 103, y: 103, w: 10, h: 10 }, 'bad3');
    tree.insert({ x: 104, y: 104, w: 10, h: 10 }, 'bad4');
    tree.insert({ x: 105, y: 105, w: 10, h: 10 }, 'bad5');
    tree.insert({ x: 106, y: 106, w: 10, h: 10 }, 'bad6');
    tree.insert({ x: 107, y: 107, w: 10, h: 10 }, 'bad7');
    tree.insert({ x: 108, y: 108, w: 10, h: 10 }, 'bad8');
    tree.insert({ x: 109, y: 109, w: 10, h: 10 }, 'bad9');
    tree.insert({ x: 110, y: 110, w: 10, h: 10 }, 'bad10');

    var dfd = tree.serialize(spy);
    expect(spy.mostRecentCall.args[1].h).toEqual(110);
    expect(spy.mostRecentCall.args[1].w).toEqual(110);
    expect(spy.mostRecentCall.args[1].nodes.length).toEqual(3);
  });

  it("shoud find one entry when restoring from a serialized rtree", function(){
    var spy = jasmine.createSpy();
    var serializedTree = {
      x: 10,
      y: 10,
      w: 100,
      h: 100,
      id: 'root',
      nodes: [
        {
          x: 10,
          y: 10,
          w: 10,
          h: 10,
          leaf: 'good'
        },
        {
          x: 100,
          y: 100,
          w: 10,
          h: 10,
          leaf: 'bad'
        }
      ]
    };

    var tree = new Terraformer.RTree();

    tree.deserialize(serializedTree);

    tree.search({ x: 15, y: 15, w: 0, h: 0 }, spy);

    expect(spy).toHaveBeenCalledWith(null, ["good"]);
  });

  it("should be able to add GeoJSON and find 1 result", function(){
    var tree = new Terraformer.RTree();
    var spy = jasmine.createSpy();
    tree.insert({
      type: "Polygon",
      coordinates: [
        [ [10,10], [10, 20], [20, 20], [20, 10] ]
      ]
    }, 'good');

    var dfd = tree.search({ x: 15, y: 15, w: 0, h: 0 }, spy);

    expect(spy).toHaveBeenCalledWith(null, ["good"]);
  });

  it("should be able to add GeoJSON and find 1 result", function(){
    var tree = new Terraformer.RTree();
    var spy = jasmine.createSpy();
    var polygon = {
      type: "Polygon",
      coordinates: [
        [ [10,10], [10, 20], [20, 20], [20, 10] ]
      ]
    };

    tree.insert(polygon, 'good');
    tree.remove(polygon);

    var dfd = tree.search({ x: 15, y: 15, w: 0, h: 0 }, spy);

    expect(spy).toHaveBeenCalledWith(null, [ ]);
  });

  it("should be able to create an index with a different width", function () {
    var tree = new Terraformer.RTree(10);
    expect(tree.min_width).toEqual(5);
    expect(tree.max_width).toEqual(10);
  });
});