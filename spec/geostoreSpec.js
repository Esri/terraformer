if(typeof module === "object"){
  var Terraformer = require("../dist/node/terraformer.js");
  Terraformer.RTree = require("../dist/node/RTree/index.js").RTree;
  Terraformer.Store = {};
  Terraformer.Store.Memory = require("../src/Store/Memory.js").Memory;
  Terraformer.GeoStore = require("../dist/node/GeoStore/index.js").GeoStore;
}

describe("geostore", function() {
  describe("with a memory store and rtree", function(){
    var gs;

    it("should create with a Memory store and an RTree", function(){
      expect(function() {
        gs = new Terraformer.GeoStore({
          store: new Terraformer.Store.Memory(),
          index: new Terraformer.RTree()
        });
      }).not.toThrow();
      expect(gs).toBeTruthy();
    });

    it("should add features to a store", function(){
      gs.add({"type":"Feature","id":"41051","properties":{"name":"Multnomah"},"geometry":{"type":"Polygon","coordinates":[[[-122.926547,45.725029],[-122.762239,45.730506],[-122.247407,45.549767],[-121.924267,45.648352],[-121.820205,45.462136],[-122.356945,45.462136],[-122.745808,45.434751],[-122.926547,45.725029]]]}});
      gs.add({"type":"Feature","id":"41067","properties":{"name":"Washington"},"geometry":{"type":"Polygon","coordinates":[[[-123.134671,45.779798],[-122.926547,45.725029],[-122.745808,45.434751],[-122.866301,45.319735],[-123.063471,45.401889],[-123.463287,45.434751],[-123.359225,45.779798],[-123.134671,45.779798]]]}});
      expect(gs.store.data[41051]).toBeTruthy();
      expect(gs.store.data[41067]).toBeTruthy();
    });

    it("should find one result", function(){
      var result;
      gs.contains({
        type:"Point",
        coordinates: [-122.676048, 45.516544]
      }).then(function(found){
        expect(found.length).toEqual(1);
        expect(found[0].id).toEqual("41051");
      });
    });

    it("should remove a feature", function(){
      var result;
      gs.remove(41051);
      expect(gs.store.data[41051]).toBeFalsy();
      expect(gs.store.data[41067]).toBeTruthy();
    });

    it("shouldn't find any results", function(){
      var result;
      gs.contains({
        type:"Point",
        coordinates: [-122.676048, 45.516544]
      }).then(function(found){
        expect(found.length).toEqual(0);
      });
    });
  });

  if(typeof module !== "object"){
    describe("with a LocalStorage store and rtree", function(){
      var gs;

      it("should create with a LocalStorage and an RTree", function(){
        expect(function() {
          gs = new Terraformer.GeoStore({
            store: new Terraformer.Store.LocalStorage(),
            index: new Terraformer.RTree()
          });
        }).not.toThrow();
        expect(gs).toBeTruthy();
      });

      it("should find one result", function(){
        var result;
        gs.add({"type":"Feature","id":"41051","properties":{"name":"Multnomah"},"geometry":{"type":"Polygon","coordinates":[[[-122.926547,45.725029],[-122.762239,45.730506],[-122.247407,45.549767],[-121.924267,45.648352],[-121.820205,45.462136],[-122.356945,45.462136],[-122.745808,45.434751],[-122.926547,45.725029]]]}});
        gs.add({"type":"Feature","id":"41067","properties":{"name":"Washington"},"geometry":{"type":"Polygon","coordinates":[[[-123.134671,45.779798],[-122.926547,45.725029],[-122.745808,45.434751],[-122.866301,45.319735],[-123.063471,45.401889],[-123.463287,45.434751],[-123.359225,45.779798],[-123.134671,45.779798]]]}});
        gs.contains({
          type:"Point",
          coordinates: [-122.676048, 45.516544]
        }).then(function(found){
          expect(found.length).toEqual(1);
          expect(found[0].id).toEqual("41051");
        });
      });

      it("shouldn't find any results if a feature is removed", function(){
        var result;
        gs.remove(41051);
        gs.contains({
          type:"Point",
          coordinates: [-122.676048, 45.516544]
        }).then(function(found){
          expect(found.length).toEqual(0);
        });
      });
    });

  }

});