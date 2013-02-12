(function (root, factory) {
  if(typeof module === 'object' && typeof module.exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    Terraformer = require('terraformer');
    exports = module.exports = factory();
  }else if(typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module and pass in Terraformer core as a requirement...
    define(["terraformer/terraformer"],factory);
  } else {
    if (typeof root.Terraformer === "undefined") {
      root.Terraformer = {};
    }

    root.Terraformer.GeoStore = factory();
  }
}(this, function() {
  var exports = { };

  // if we are in AMD terraformer core got passed in as our first requirement so we should set it.
  if(arguments[0] && typeof define === 'function' && define.amd) {
    this.Terraformer = arguments[0];
  }

  function Deferred () {
    this._thens = [];
  }

  Deferred.prototype = {

    /* This is the "front end" API. */

    // then(onResolve, onReject): Code waiting for this promise uses the
    // then() method to be notified when the promise is complete. There
    // are two completion callbacks: onReject and onResolve. A more
    // robust promise implementation will also have an onProgress handler.
    then: function (onResolve, onReject) {
      // capture calls to then()
      this._thens.push({ resolve: onResolve, reject: onReject });
    },

    // Some promise implementations also have a cancel() front end API that
    // calls all of the onReject() callbacks (aka a "cancelable promise").
    // cancel: function (reason) {},

    /* This is the "back end" API. */

    // resolve(resolvedValue): The resolve() method is called when a promise
    // is resolved (duh). The resolved value (if any) is passed by the resolver
    // to this method. All waiting onResolve callbacks are called
    // and any future ones are, too, each being passed the resolved value.
    resolve: function (val) {
      this._complete('resolve', val);
    },

    // reject(exception): The reject() method is called when a promise cannot
    // be resolved. Typically, you'd pass an exception as the single parameter,
    // but any other argument, including none at all, is acceptable.
    // All waiting and all future onReject callbacks are called when reject()
    // is called and are passed the exception parameter.
    reject: function (ex) {
      this._complete('reject', ex);
    },

    // Some promises may have a progress handler. The back end API to signal a
    // progress "event" has a single parameter. The contents of this parameter
    // could be just about anything and is specific to your implementation.
    // progress: function (data) {},

    /* "Private" methods. */

    _complete: function (which, arg) {
      // switch over to sync then()
      this.then = (which === 'resolve') ?
        function (resolve, reject) { resolve(arg); } :
        function (resolve, reject) { reject(arg); };
      // disallow multiple calls to resolve or reject
      this.resolve = this.reject =
        function () { throw new Error('Deferred already completed.'); };
      // complete all waiting (async) then()s
      for (var i = 0; i < this._thens.length; i++) {
        var aThen = this._thens[i];
        if(aThen[which]) {
          aThen[which](arg);
        }
      }
      delete this._thens;
    }
  };

  // The store object that ties everything together...
  /* OPTIONS
  {
    store: Terraformer.Stores.Memory,
    index: Terraformer.RTree,
    deferred: Terraformer.Deferred,
    data: [Geojson to be added into the store]
  }
  */
  function GeoStore(options){
    var config = options || {};
    this.data = {};
    this.ids = {};
    this.index = (config.index) ? new config.index() : new Terraformer.RTree.RTree();
    this.store = (config.store) ? new config.store() : new Terraformer.Stores.Memory();
    this.deferred = (config.deferred) ? config.deferred : Deferred;
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
      throw new Error("Terraform.GeoStore : only Features are supported");
    }

    if(!geojson.id) {
      throw new Error("Terraform.GeoStore : Feature does not have an id property");
    }

    // set a bounding box
    if(geojson.type ==="FeatureCollection"){
      for (var i = 0; i < geojson.features.length; i++) {
        bbox = (geojson.features[i]) ? geojson.features[i] : Terraformer.Tools.calculateBounds(geojson.features[i]);
        this.index.insert({
          x: bbox[0],
          y: bbox[1],
          w: Math.abs(bbox[0] - bbox[2]),
          h: Math.abs(bbox[1] - bbox[3])
        }, geojson.features[i].id);
      }
    } else {
      bbox = (geojson.bbox) ? geojson.bbox : Terraformer.Tools.calculateBounds(geojson);
      this.index.insert({
        x: bbox[0],
        y: bbox[1],
        w: Math.abs(bbox[0] - bbox[2]),
        h: Math.abs(bbox[1] - bbox[3])
      }, geojson.id);
    }

    // store the data (use the stores store method to decide how to do this.)
    this.store.add(geojson, dfd);

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

    // remove from the store
    return dfd;
  };

  GeoStore.prototype.contains = function(point, callback){
    // query the store for all polygons that contain point.

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
    var envelope = Terraformer.Tools.calculateEnvelope(point);

    // search the index
    var found = this.index.search(envelope);

    // empty wrapper for results
    var results = [];
    var completed = 0;
    var evaluate = function(geojson){
      completed++;
      var poly = new Terraformer.Primitive(geojson);
      if(poly.contains(point)){
        results.push(poly);
      }
      if(completed >= found.length){
        dfd.resolve(results);
      }
    };

    // for each result see if the polygon contains the point
    for (var i = 0; i < found.length; i++) {
      this.get(found[i]).then(evaluate);
    }

    // return the deferred
    return dfd;
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

  exports = GeoStore;

  return exports;
}));