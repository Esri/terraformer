function extend (destination, source) {
  for (var k in source) {
    if (source.hasOwnProperty(k)) {
      destination[k] = source[k];
    }
  }
  return destination;
}

// super light weight EventEmitter implementation

function EventEmitter() {
  this._events = { };
  this._once   = { };
  // default to 10 max liseners
  this._maxListeners = 10;
}

EventEmitter.prototype._add = function (event, listener, once) {
  var entry = { listener: listener };
  if (once) {
    entry.once = true;
  }

  if (this._events[event]) {
    this._events[event].push(entry);
  } else {
    this._events[event] = entry;
  }

  if (this._maxListeners && this._events[event].count > this._maxListeners && console && console.warn) {
    console.warn("EventEmitter Error: Maximum number of listeners");
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener = function (event, listener) {
  return this._add(event, listener);
};

EventEmitter.prototype.once = function (event, listener) {
  return this._add(event, listener, true);
};

EventEmitter.prototype.removeListener = function (event, listener) {
  if (!this._events[event]) {
    return this;
  }

  for(var i = this._events.length-1; i--;) {
    if (this._events[i].listener === callback) {
      this._events.splice(i, 1);
    }
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function (event) {
  this._events[event] = undefined;

  return this;
};

EventEmitter.prototype.setMaxListeners = function (count) {
  this._maxListeners = count;

  return this;
};

EventEmitter.prototype.emit = function () {
  var args = Array.prototype.slice.apply(arguments);
  var remove = [ ], i;

  if (args.length) {
    var event = args.shift();

    if (this._events[event]) {
      for (i = this._events[event].length; i--;) {
        this._events[event].listener.apply(args);
        if (this._events[event].once) {
          remove.push(listener);
        }
      }
    }

    for (i = remove.length; i--;) {
      this.removeListener(event, remove[i]);
    }
  }

  return this;
};
function ReadableStream () {
  var self = this;

  this._destination = [ ];
  this._emit = this.emit;

  this.emit = function (signal, data) {
    var i;

    if (signal === "data") {
      for (i = self._destination.length; i--;) {
        self._destination[i].write(data);
      }
    } else if (signal === "end") {
      for (i = self._destination.length; i--;) {
        self._destination[i].write(data);
      }
    }
    self._emit(signal, data);
  };
}

extend(ReadableStream, EventEmitter);

ReadableStream.prototype.pipe = function (destination) {
  this._destination.push(destination);
};

ReadableStream.prototype.unpipe = function (destination) {
  if (!destination) {
    this._destination = [ ];
  } else {
    for(var i = this._destination.length-1; i--;) {
      if (this._destination[i].listener === destination) {
        this._destination.splice(i, 1);
      }
    }
  }
};

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
  }
  */
  function GeoStore(config){

    if(!config.store || !config.index){
      throw new Error("Terraformer.GeoStore requires an instace of a Terraformer.Store and a instance of Terraformer.RTree");
    }
    this.deferred = (config.deferred) ? config.deferred : Terraformer.Deferred;
    this.index = config.index;
    this.store = config.store;
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

    if(geojson.type === "Feature" && !geojson.id) {
      throw new Error("Terraform.GeoStore : Feature does not have an id property");
    }

    // set a bounding box
    if(geojson.type === "FeatureCollection"){
      for (var i = 0; i < geojson.features.length; i++) {
        var feature = geojson.features[i];
        bbox = Terraformer.Tools.calculateBounds(feature);
        if(!feature.id) {
          throw new Error("Terraform.GeoStore : Feature does not have an id property");
        }
        this.index.insert({
          x: bbox[0],
          y: bbox[1],
          w: Math.abs(bbox[0] - bbox[2]),
          h: Math.abs(bbox[1] - bbox[3])
        }, feature.id);
      }
      this.store.add(geojson, dfd);
    } else {
      bbox = Terraformer.Tools.calculateBounds(geojson);
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
    var dfd = new this.deferred();

    if(callback){
      dfd.then(function(result){
        callback(null, result);
      }, function(error){
        callback(error, null);
      });
    }

    this.get(id).then(bind(this, function(geojson){
      this.index.remove(geojson, id, bind(this, function(error, leaf){
        if(error){
          dfd.reject("Could not remove from index");
        } else {
          this.store.remove(id, dfd);
        }
      }));
    }), function(error){
      dfd.reject("Could not remove feature");
    });

    return dfd;
  };

  GeoStore.prototype.contains = function(geojson, callback){
    // make a new deferred
    var shape = new Terraformer.Primitive(geojson);
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
      var errors = 0;

      // the function to evalute results from the index
      var evaluate = function(primitive){
        completed++;
        var geometry = new Terraformer.Primitive(primitive.geometry);

        if(shape.within(geometry)){
          results.push(primitive);
        }

        if(completed >= found.length){
          if(!errors){
            dfd.resolve(results);
          } else {
            dfd.reject("Could not get all geometries");
          }
        }

        if(completed >= found.length && errors){
          dfd.reject("Could not get all geometries");
        }

      };

      var error = function(){
        completed++;
        errors++;
        if(completed >= found.length){
          dfd.reject("Could not get all geometries");
        }
      };

      // for each result see if the polygon contains the point
      if(found.length){

        for (var i = 0; i < found.length; i++) {
          this.get(found[i]).then(evaluate, error);
        }
      } else {
        dfd.resolve(results);
      }

    }));

    // return the deferred
    return dfd;
  };

  GeoStore.prototype.within = function(geojson, callback){
    // make a new deferred
    var shape = new Terraformer.Primitive(geojson);
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

    // search the index using within
    this.index.within(envelope).then(bind(this, function(found){
      var results = [];
      var completed = 0;
      var errors = 0;

      // the function to evalute results from the index
      var evaluate = function(primitive){
        completed++;
        var geometry = new Terraformer.Primitive(primitive.geometry);

        if(geometry.within(shape)){
          results.push(primitive);
        }

        if(completed >= found.length){
          if(!errors){
            dfd.resolve(results);
          } else {
            dfd.reject("Could not get all geometries");
          }
        }

        if(completed >= found.length && errors){
          dfd.reject("Could not get all geometries");
        }

      };

      var error = function(){
        completed++;
        errors++;
        if(completed >= found.length){
          dfd.reject("Could not get all geometries");
        }
      };

      // for each result see if the polygon contains the point
      if(found.length){

        for (var i = 0; i < found.length; i++) {
          this.get(found[i]).then(evaluate, error);
        }
      } else {
        dfd.resolve(results);
      }

    }));

    // return the deferred
    return dfd;
  };

  GeoStore.prototype.update = function(geojson, callback){
    var feature = Terraformer.Primitive(geojson);
    var dfd = new this.deferred();

    if(callback){
      dfd.then(function(result){
        callback(null, result);
      }, function(error){
        callback(error, null);
      });
    }

    if (feature.type !== "Feature") {
      throw new Error("Terraform.GeoStore : only Features and FeatureCollections are supported");
    }

    if(!feature.id) {
      throw new Error("Terraform.GeoStore : Feature does not have an id property");
    }

    this.get(feature.id).then(bind(this, function(oldFeatureGeoJSON){
      var oldFeature = new Terraformer.Primitive(oldFeatureGeoJSON);
      this.index.remove(oldFeature.envelope(), oldFeature.id);
      this.index.insert(feature.envelope(), feature.id);
      this.store.update(feature, dfd);
    }), function(error){
      dfd.reject("Could find feature");
    });

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