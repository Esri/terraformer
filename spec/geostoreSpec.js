    var gs;

if(typeof module === "object"){
  var Terraformer = require("../dist/node/terraformer.js");
  Terraformer.RTree = require("../dist/node/RTree/index.js").RTree;
  Terraformer.Store = {};
  Terraformer.Store.Memory = require("../src/Store/Memory.js").Memory;
  Terraformer.GeoStore = require("../dist/node/GeoStore/index.js").GeoStore;
}

describe("geostore", function() {
  describe("with a memory store and rtree", function(){

    it("should throw an error when initalized without a store or index", function(){
      expect(function() {
        gs = new Terraformer.GeoStore({});
      }).toThrow();
      expect(gs).toBeFalsy();
    });

    it("should create with a Memory store and an RTree", function(){
      expect(function() {
        gs = new Terraformer.GeoStore({
          store: new Terraformer.Store.Memory(),
          index: new Terraformer.RTree()
        });
      }).not.toThrow();
      expect(gs).toBeTruthy();
    });

    it("should throw an error when a feautre without an id is added", function(){
      expect(function() {
        gs.add({"type":"Feature","properties":{"name":"Multnomah"},"geometry":{"type":"Polygon","coordinates":[[[-122.926547,45.725029],[-122.762239,45.730506],[-122.247407,45.549767],[-121.924267,45.648352],[-121.820205,45.462136],[-122.356945,45.462136],[-122.745808,45.434751],[-122.926547,45.725029]]]}});
      }).toThrow();
    });

    it("should throw an error adding invalid features to a store", function(){
      expect(function() {
        gs.add({
          "type": "FeatureCollection",
          "features":[
            {"type":"Polygon","coordinates":[[[-123.134671,45.779798],[-122.926547,45.725029],[-122.745808,45.434751],[-122.866301,45.319735],[-123.063471,45.401889],[-123.463287,45.434751],[-123.359225,45.779798],[-123.134671,45.779798]]]},
            {"type":"Feature","properties":{"name":"Clackamas"},"geometry":{"type":"Polygon","coordinates":[[[-122.356945,45.462136],[-121.820205,45.462136],[-121.694236,45.259489],[-121.732574,44.887057],[-122.395284,44.887057],[-122.84987,45.259489],[-122.866301,45.319735],[-122.745808,45.434751],[-122.356945,45.462136]]]}}
          ]
        });
      }).toThrow();
    });

    it("should throw an error when a GeoJSON object that is not a feature or a feautre collections is added", function(){
      expect(function() {
        gs.add({"type":"Polygon","coordinates":[[[-122.926547,45.725029],[-122.762239,45.730506],[-122.247407,45.549767],[-121.924267,45.648352],[-121.820205,45.462136],[-122.356945,45.462136],[-122.745808,45.434751],[-122.926547,45.725029]]]});
      }).toThrow();
    });

    it("should add features to a store", function(){
      gs.add({"type":"Feature","id":"41051","properties":{"name":"Multnomah"},"geometry":{"type":"Polygon","coordinates":[[[-122.926547,45.725029],[-122.762239,45.730506],[-122.247407,45.549767],[-121.924267,45.648352],[-121.820205,45.462136],[-122.356945,45.462136],[-122.745808,45.434751],[-122.926547,45.725029]]]}});
      expect(gs.store.data[41051]).toBeTruthy();
    });

    it("should add features to a store and run a callback", function(){
      var spy = jasmine.createSpy();
      gs.add({
        "type": "FeatureCollection",
        "features":[
          {"type":"Feature","id":"41067","properties":{"name":"Washington"},"geometry":{"type":"Polygon","coordinates":[[[-123.134671,45.779798],[-122.926547,45.725029],[-122.745808,45.434751],[-122.866301,45.319735],[-123.063471,45.401889],[-123.463287,45.434751],[-123.359225,45.779798],[-123.134671,45.779798]]]}},
          {"type":"Feature","id":"41005","properties":{"name":"Clackamas"},"geometry":{"type":"Polygon","coordinates":[[[-122.356945,45.462136],[-121.820205,45.462136],[-121.694236,45.259489],[-121.732574,44.887057],[-122.395284,44.887057],[-122.84987,45.259489],[-122.866301,45.319735],[-122.745808,45.434751],[-122.356945,45.462136]]]}}
        ]
      }, spy);
      expect(spy.callCount).toEqual(1);
      expect(gs.store.data[41067]).toBeTruthy();
      expect(gs.store.data[41005]).toBeTruthy();
    });

    it("should find no results", function(){
      var result;
      gs.contains({
        type:"Point",
        coordinates: [0, 0]
      }, function(error, found){
        expect(found.length).toEqual(0);
      });
    });

    it("should find one result", function(){
      var result;
      gs.contains({
        type:"Point",
        coordinates: [-122.676048, 45.516544]
      }, function(error, found){
        expect(found.length).toEqual(1);
        expect(found[0].id).toEqual("41051");
      });
    });


    it("should remove a feature", function(){
      var result;
      var spy = jasmine.createSpy();
      gs.remove("41051", spy);
      expect(spy.callCount).toEqual(1);
      expect(gs.store.data[41051]).toBeFalsy();
      expect(gs.store.data[41067]).toBeTruthy();
    });

    it("shouldn't find any results", function(){
      var result;
      gs.contains({
        type:"Point",
        coordinates: [-122.676048, 45.516544]
      }, function(error, found){
        expect(found.length).toEqual(0);
      });
    });

    it("should get a single result by id", function(){
      var result;
      gs.get("41067", function(error, found){
        expect(found.id).toEqual("41067");
      });
    });

    it("should update a feature and run a successful query", function(){
      var result;
      var spy = jasmine.createSpy();
      gs.update({"type":"Feature","id":"41067","properties":{"name":"Multnomah"},"geometry":{"type":"Polygon","coordinates":[[[-122.926547,45.725029],[-122.762239,45.730506],[-122.247407,45.549767],[-121.924267,45.648352],[-121.820205,45.462136],[-122.356945,45.462136],[-122.745808,45.434751],[-122.926547,45.725029]]]}}, spy);
      expect(spy.callCount).toEqual(1);
      gs.contains({
        type:"Point",
        coordinates: [-122.676048, 45.516544]
      }, function(error, found){
        expect(found.length).toEqual(1);
        expect(found[0].id).toEqual("41067");
      });
    });

    it("should update features in store and run a callback", function(){
      var spy = jasmine.createSpy();
      gs.update({"type":"Feature","id":"41067","properties":{"name":"Multnomah"},"geometry":{"type":"Polygon","coordinates":[[[-122.926547,45.725029],[-122.762239,45.730506],[-122.247407,45.549767],[-121.924267,45.648352],[-121.820205,45.462136],[-122.356945,45.462136],[-122.745808,45.434751],[-122.926547,45.725029]]]}}, spy);
      expect(spy.callCount).toEqual(1);
    });

    var serial;

    it("should serialize a Memory store", function(){
      var callback = jasmine.createSpy("callback");
      gs.store.serialize(callback);
      expect(callback).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(null, JSON.stringify(gs.store.data));
    });

    it("should deserialize a memory store", function(){
      var spy = jasmine.createSpy();
      var serial;
      gs.store.serialize(function(error, data){
        serial = data;
      });
      gs = new Terraformer.GeoStore({
        store: new Terraformer.Store.Memory().deserialize(serial),
        index: new Terraformer.RTree()
      });
      expect(gs.store.data[41005]).toBeTruthy();
      expect(gs.store.data[41067]).toBeTruthy();
    });

    var badStore = new Terraformer.GeoStore({
      store: {
        get: function(id, callback){
          return callback("ERROR", null);
        },
        add: function(geo, callback){
          return callback("ERROR", null);
        },
        remove: function(id, callback){
          return callback("ERROR", null);
        },
        update: function(geo, callback){
          return callback("ERROR", null);
        }
      },
      index: new Terraformer.RTree()
    });

    it("should run an error callback when the store rejects the deferred when adding an item", function(){
      var spy = jasmine.createSpy();
      badStore.add({"type":"Feature","id":"41067","properties":{"name":"Multnomah"},"geometry":{"type":"Polygon","coordinates":[[[-122.926547,45.725029],[-122.762239,45.730506],[-122.247407,45.549767],[-121.924267,45.648352],[-121.820205,45.462136],[-122.356945,45.462136],[-122.745808,45.434751],[-122.926547,45.725029]]]}}, spy);
      expect(spy).toHaveBeenCalledWith("ERROR", null);
    });

    it("should run an error callback when the store rejects the deferred when updating an item", function(){
      var spy = jasmine.createSpy();
      badStore.update({"type":"Feature","id":"41067","properties":{"name":"Multnomah"},"geometry":{"type":"Polygon","coordinates":[[[-122.926547,45.725029],[-122.762239,45.730506],[-122.247407,45.549767],[-121.924267,45.648352],[-121.820205,45.462136],[-122.356945,45.462136],[-122.745808,45.434751],[-122.926547,45.725029]]]}}, spy);
      expect(spy).toHaveBeenCalledWith('Could find feature', null);
    });

    it("should return an error in the callback when the store cant get an item", function(){
      var spy = jasmine.createSpy();
      badStore.get("41067", spy);
      expect(spy).toHaveBeenCalledWith("ERROR", null);
    });

    it("should return an error in the callback when the store cant find a feature to remove", function(){
      var spy = jasmine.createSpy();
      badStore.remove("41067", spy);
      expect(spy).toHaveBeenCalledWith('Could not get feature to remove', null);
    });

    it("should run an error callback when the store rejects the deferred when querying an item", function(){
      var spy = jasmine.createSpy();
      badStore.contains({
        type:"Point",
        coordinates: [-122.676048, 45.516544]
      }, spy);
      expect(spy).toHaveBeenCalledWith("Could not get all geometries", null);
    });
  });

  if(typeof navigator !== "undefined"){
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
        }, function(error, found){
          expect(found.length).toEqual(1);
          expect(found[0].id).toEqual("41051");
        });
      });

      it("shouldn't find any results if a feature is removed", function(){
        var result;
        gs.remove("41051");
        gs.within({
          type:"Point",
          coordinates: [-122.676048, 45.516544]
        }, function(error, found){
          expect(found.length).toEqual(0);
        });
      });

      it("should update a feature and run a successful query", function(){
        var result;
        gs.update({"type":"Feature","id":"41067","properties":{"name":"Multnomah"},"geometry":{"type":"Polygon","coordinates":[[[-122.926547,45.725029],[-122.762239,45.730506],[-122.247407,45.549767],[-121.924267,45.648352],[-121.820205,45.462136],[-122.356945,45.462136],[-122.745808,45.434751],[-122.926547,45.725029]]]}});
        gs.contains({
          type:"Point",
          coordinates: [-122.676048, 45.516544]
        }, function( error, found){
          expect(found.length).toEqual(1);
          expect(found[0].id).toEqual("41067");
        });
      });

      it("should throw an error when a feautre without an id is updated", function(){
        expect(function() {
          gs.update({"type":"Feature","properties":{"name":"Multnomah"},"geometry":{"type":"Polygon","coordinates":[[[-122.926547,45.725029],[-122.762239,45.730506],[-122.247407,45.549767],[-121.924267,45.648352],[-121.820205,45.462136],[-122.356945,45.462136],[-122.745808,45.434751],[-122.926547,45.725029]]]}});
        }).toThrow();
      });

      it("should throw an error when a GeoJSON object that is not a feature or a feautre collections is updated", function(){
        expect(function() {
          gs.update({"type":"Polygon","coordinates":[[[-122.926547,45.725029],[-122.762239,45.730506],[-122.247407,45.549767],[-121.924267,45.648352],[-121.820205,45.462136],[-122.356945,45.462136],[-122.745808,45.434751],[-122.926547,45.725029]]]});
        }).toThrow();
      });

      it("should serialize a LocalStore store", function(){
        var callback = jasmine.createSpy("callback");
        gs.store.serialize(callback);
        expect(callback).toHaveBeenCalled();
      });

      it("should deserialize a LocalStore store", function(){
        var spy = jasmine.createSpy();
        var serial;
        gs.store.serialize(function(error, data){
          serial = data;
        });
        gs = new Terraformer.GeoStore({
          store: new Terraformer.Store.LocalStorage().deserialize(serial),
          index: new Terraformer.RTree()
        });
        expect(window.localStorage[gs.store._key+"_41067"]).toBeTruthy();
      });
    });

  }

  describe("with a memory store and rtree and within", function(){
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

    it("should be able to add coordinates", function(){
      expect(function() {
        gs.add({ "id": 1, "type": "Feature", "geometry": { "type": "Polygon", "coordinates": [ [ [ -122.655849602879201, 45.538304922840894, 0.0 ], [ -122.655691867426299, 45.538304448196108, 0.0 ], [ -122.655692285611451, 45.538236031205983, 0.0 ], [ -122.655850019628431, 45.538236506773742, 0.0 ], [ -122.655849602879201, 45.538304922840894, 0.0 ] ] ] } });
        gs.add({ "id": 2, "type": "Feature", "geometry": { "type": "Polygon", "coordinates": [ [ [ -122.589480827112766, 45.477987695417717, 0.0 ], [ -122.589481271327131, 45.477926424718063, 0.0 ], [ -122.589631424206658, 45.477926964033657, 0.0 ], [ -122.589630980154141, 45.477988234733886, 0.0 ], [ -122.589480827112766, 45.477987695417717, 0.0 ] ] ] } });
      }).not.toThrow();
      expect(gs).toBeTruthy();
    });

    it("should be able to find the correct id using within", function(){
      gs.within({
        "type": "Polygon",
        "coordinates": [ [ [ -122.655849602879201, 45.538304922840894, 0.0 ], [ -122.655691867426299, 45.538304448196108, 0.0 ], [ -122.655692285611451, 45.538236031205983, 0.0 ], [ -122.655850019628431, 45.538236506773742, 0.0 ], [ -122.655849602879201, 45.538304922840894, 0.0 ] ] ]
      }, function (err, res) {
        expect(res[0].id).toEqual(1);
      });
    });
  });

});
