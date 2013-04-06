if(typeof module === "object"){
 var Terraformer = require("../../dist/node/terraformer.js");
 Terraformer.RTree = require("../../dist/node/RTree/index.js");
}

describe("RTree", function(){
  it("Given an RTree with 1 Entry and a Point that is Within that Entry", function(){
    var tree = new Terraformer.RTree();
    var spy = jasmine.createSpy();
    tree.insert({ x: 10, y: 10, w: 10, h: 10 }, 'good');

    var dfd = tree.search({ x: 15, y: 15, w: 0, h: 0 }, spy);

    expect(spy).toHaveBeenCalledWith(null, ["good"]);
  });

  it("Given an RTree with 1 Entry and a Point that is not Within That Entry", function(){
    var tree = new Terraformer.RTree();
    var spy = jasmine.createSpy();

    tree.insert({ x: 10, y: 10, w: 10, h: 10 }, 'bad');

    dfd = tree.search({ x: 1, y: 1, w: 0, h: 0 }, spy);

    expect(spy).toHaveBeenCalledWith(null, [ ]);
  });

  it("Given an RTree with Multiple Entries and a Point that is Within One Entry", function(){
    var tree = new Terraformer.RTree();
    var spy = jasmine.createSpy();

    tree.insert({ x: 10, y: 10, w: 10, h: 10 }, 'good');
    tree.insert({ x: 100, y: 100, w: 10, h: 10 }, 'bad');

    var dfd = tree.search({ x: 15, y: 15, w: 0, h: 0 }, spy);

    expect(spy).toHaveBeenCalledWith(null, ["good"]);
  });

  it("Given an RTree with Multiple Entries and a Point that is not Within Those Entries", function(){
    var tree = new Terraformer.RTree();
    var spy = jasmine.createSpy();

    tree.insert({ x: 10, y: 10, w: 10, h: 10 }, 'good');
    tree.insert({ x: 100, y: 100, w: 10, h: 10 }, 'bad');

    var dfd = tree.search({ x: 1, y: 1, w: 0, h: 0 }, spy);

    expect(spy).toHaveBeenCalledWith(null, []);
  });

  it("Given an RTree with Multiple Entries and a Point that is not Within Those Entries", function(){
    var tree = new Terraformer.RTree();
    var spy = jasmine.createSpy();

    tree.insert({ x: 10, y: 10, w: 10, h: 10 }, 'good');
    tree.insert({ x: 100, y: 100, w: 10, h: 10 }, 'bad');

    tree.remove({ x: 10, y: 10, w: 10, h: 10 });

    var dfd = tree.search({ x: 15, y: 15, w: 0, h: 0 }, spy);

    expect(spy).toHaveBeenCalledWith(null, []);
  });

  it("When Calling serialize()", function(){
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

  it("When a Tree is Set via deserialize() and a searc() Occurs", function(){
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
});