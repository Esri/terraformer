(function (root, factory) {

  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    exports = module.exports = factory();
  }

  // AMD.
  if(typeof define === 'function' && define.amd) {
    define(["terraformer/terraformer"],factory);
  }

  // Browser Global.
  if(typeof root.navigator === "object") {
    if (typeof root.Terraformer === "undefined"){
      root.Terraformer = {};
    }
    root.Terraformer.GeoStore = factory().GeoStore;
  }

}(this, function() {
  var exports = { };
  var Terraformer;

  // Local Reference To Browser Global
  if(typeof this.navigator === "object") {
    Terraformer = this.Terraformer;
  }

  // Setup Node Dependencies
  if(typeof module === 'object' && typeof module.exports === 'object') {
    Terraformer = require('terraformer');
  }

  // Setup AMD Dependencies
  if(arguments[0] && typeof define === 'function' && define.amd) {
    Terraformer = arguments[0];
  }

  function bind(obj, fn) {
    var args = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : null;
    return function () {
      return fn.apply(obj, args || arguments);
    };
  }

  // The store object that ties everything together...
  /* OPTIONS
  {
    store: Terraformer.Store.Memory,
    index: Terraformer.RTree,
    deferred: Terraformer.Deferred,
    data: [Geojson to be added into the store]
  }
  */
  function GeoStore(config){

    if(!config.store || !config.index){
      throw new Error("Terraformer.GeoStore requires an instace of a Terraformer.Store and a instance of Terraformer.RTree");
    }
    this.deferred = (config.deferred) ? config.deferred : Terraformer.Deferred;
    this.index = config.index;
    this.store = config.store;
    var data = config.data || [];
    while(data.length){
      this.add(data.shift());
    }
  }

  // add the geojson object to the store
  // calculate the envelope and add it to the rtree
  // should return a deferred
  GeoStore.prototype.add = function(geojson, callback){
    var dfd = new this.deferred(), bbox;

    if(callback){
      dfd.then(function(result){
        callback(null, result);
      }, function(error){
        callback(error, null);
      });
    }

    if (!geojson.type.match(/Feature/)) {
      throw new Error("Terraform.GeoStore : only Features and FeatureCollections are supported");
    }

    if(!geojson.id) {
      throw new Error("Terraform.GeoStore : Feature does not have an id property");
    }

    // set a bounding box
    if(geojson.type === "FeatureCollection"){
      for (var i = 0; i < geojson.features.length; i++) {
        var feature = geojson.features[i];
        bbox = (feature) ? feature : Terraformer.Tools.calculateBounds(feature);
        this.index.insert({
          x: bbox[0],
          y: bbox[1],
          w: Math.abs(bbox[0] - bbox[2]),
          h: Math.abs(bbox[1] - bbox[3])
        }, feature.id);
        this.store.add(feature, dfd);
      }
    } else {
      bbox = (geojson.bbox) ? geojson.bbox : Terraformer.Tools.calculateBounds(geojson);
      this.index.insert({
        x: bbox[0],
        y: bbox[1],
        w: Math.abs(bbox[0] - bbox[2]),
        h: Math.abs(bbox[1] - bbox[3])
      }, geojson.id);
      this.store.add(geojson, dfd);
    }

    // store the data (use the stores store method to decide how to do this.)

    // return the deferred;
    return dfd;
  };

  GeoStore.prototype.remove = function(id, callback){
    // removes a geojson object from the store by id.

    // make a new deferred
    var dfd = new this.deferred();

    if(callback){
      dfd.then(function(result){
        callback(null, result);
      }, function(error){
        callback(error, null);
      });
    }

    // remove from index
    this.index.remove(id);
    this.store.remove(id, dfd);

    // remove from the store
    return dfd;
  };

  GeoStore.prototype._test = function(test, shape, callback){
    // make a new deferred
    var dfd = new this.deferred();

    if(callback){
      dfd.then(function(result){
        callback(null, result);
      }, function(error){
        callback(error, null);
      });
    }

    // create our envelope
    var envelope = Terraformer.Tools.calculateEnvelope(shape);

    // search the index
    this.index.search(envelope).then(bind(this, function(found){
      var results = [];
      var completed = 0;

      // the function to evalute results from the index
      var evaluate = function(primitive){
        completed++;

        var geojson = new Terraformer.Primitive(primitive);

        if(geojson[test] && geojson[test](shape)){
          results.push(geojson);
        }

        if(completed >= found.length){
          dfd.resolve(results);
        }
      };

      // for each result see if the polygon contains the point
      for (var i = 0; i < found.length; i++) {
        this.get(found[i]).then(evaluate);
      }

    }));

    // return the deferred
    return dfd;
  };

  GeoStore.prototype.within = function(shape, callback){
    console.error("`within` is not implemented");
    //return this._test("within", shape, callback);
  };

  GeoStore.prototype.intersects = function(shape, callback){
    console.error("`intersects` is not implemented");
    //return this._test("intersects", shape, callback);
  };

  GeoStore.prototype.contains = function(shape, callback){
    console.warn("contains will be depricated soon when `within` and `intersects` are complete");
    return this._test("contains", shape, callback);
  };

  GeoStore.prototype.update = function(geojson, callback){
    // updates an existing object in the store and the index
    // accepts a geojson object and uses its id to find and update the item
    // should return a deferred

    var dfd = new this.deferred();

    if(callback){
      dfd.then(function(result){
        callback(null, result);
      }, function(error){
        callback(error, null);
      });
    }

    if (geojson.type !== "Feature") {
      throw new Error("Terraform.GeoStore : only Features and FeatureCollections are supported");
    }

    if(!geojson.id) {
      throw new Error("Terraform.GeoStore : Feature does not have an id property");
    }

    //remove the index
    this.index.remove(geojson.id);

    // set a bounding box
    var bbox = (geojson.bbox) ? geojson.bbox : Terraformer.Tools.calculateBounds(geojson);

    // index the new data
    this.index.insert({
      x: bbox[0],
      y: bbox[1],
      w: Math.abs(bbox[0] - bbox[2]),
      h: Math.abs(bbox[1] - bbox[3])
    }, geojson.id);

    // update the store
    this.store.update(geojson, dfd);

    return dfd;
  };

  // gets an item by id
  GeoStore.prototype.get = function(id, callback){

    // make a new deferred
    var dfd = new this.deferred();

    if(callback){
      dfd.then(function(result){
        callback(null, result);
      }, function(error){
        callback(error, null);
      });
    }

    this.store.get(id, dfd);

    return dfd;
  };

  exports.GeoStore = GeoStore;

  return exports;
}));