(function (root, factory) {

  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    exports = module.exports = factory(require("terraformer"));
  }

  // Browser Global.
  if(typeof root.navigator === "object") {
    if (!root.Terraformer){
      throw new Error("Terraformer.GeoStore requires the core Terraformer library. http://github.com/esri/terraformer")
    }
    root.Terraformer.GeoStore = factory(root.Terraformer).GeoStore;
  }

}(this, function(Terraformer) {

// super lightweight async to sync handling

function Sync () {
	this._steps = [ ];
  this._arguments = [ ];
  this._current = 0;
  this._error = null;
}

Sync.prototype.next = function () {
  var args = Array.prototype.slice.call(arguments);
  this._steps.push(args.shift());
  this._arguments[this._steps.length - 1] = args;

  return this;
};

Sync.prototype.error = function (error) {
  this._error = error;

  return this;
};

Sync.prototype.done = function (err) {
  this._current++;
  var args = Array.prototype.slice.call(arguments);

  // if there is an error, we are done
  if (err) {
    if (this._error) {
      this._error.apply(this, args);
    }
  } else {
    if (this._steps.length) {
      var next = this._steps.shift();
      var a = this._arguments[this._current];
      next.apply(this, this._arguments[this._current]);
    } else {
      if (this._callback) {
        this._callback();
      }
    }
  }
};

Sync.prototype.start = function (callback) {
  this._callback = callback;

  var start = this._steps.shift();

  if (start) {
    var args = this._arguments[0];
    start.apply(this, args);
  } else {
    if (this._callback) {
      this._callback();
    }
  }
};


// super light weight EventEmitter implementation

function EventEmitter() {
  this._events = { };
  this._once   = { };
  // default to 10 max liseners
  this._maxListeners = 10;

  this._add = function (event, listener, once) {
    var entry = { listener: listener };
    if (once) {
      entry.once = true;
    }

    if (this._events[event]) {
      this._events[event].push(entry);
    } else {
      this._events[event] = [ entry ];
    }

    if (this._maxListeners && this._events[event].count > this._maxListeners && console && console.warn) {
      console.warn("EventEmitter Error: Maximum number of listeners");
    }

    return this;
  };

  this.on = function (event, listener) {
    return this._add(event, listener);
  };

  this.addListener = this.on;

  this.once = function (event, listener) {
    return this._add(event, listener, true);
  };

  this.removeListener = function (event, listener) {
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

  this.removeAllListeners = function (event) {
    this._events[event] = undefined;

    return this;
  };

  this.setMaxListeners = function (count) {
    this._maxListeners = count;

    return this;
  };

  this.emit = function () {
    var args = Array.prototype.slice.apply(arguments);
    var remove = [ ], i;

    if (args.length) {
      var event = args.shift();

      if (this._events[event]) {
        for (i = this._events[event].length; i--;) {
          this._events[event][i].listener.apply(null, args);
          if (this._events[event][i].once) {
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
}

function Stream () {
  var self = this;

  EventEmitter.call(this);

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

Stream.prototype.pipe = function (destination) {
  this._destination.push(destination);
};

Stream.prototype.unpipe = function (destination) {
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


  var exports = { };

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
    index: Terraformer.RTree
  }
  */
  function GeoStore(config){

    if(!config.store || !config.index){
      throw new Error("Terraformer.GeoStore requires an instace of a Terraformer.Store and a instance of Terraformer.RTree");
    }
    this.index = config.index;
    this.store = config.store;
    this._stream = null;

    this._additional_indexes = [ ];
  }

  function checkIndexAndAdd(index, geojson, callback) {
    var property = index.property;

    // we do not currently index NULL, might be a TODO in the future
    if (geojson.properties && geojson.properties[property] !== undefined && geojson.properties[property] !== null) {
      index.index.add(geojson.properties[property], geojson.id, callback);
    }
  }

  function checkIndexAndRemove(index, geojson, callback) {
    var property = index.property;

    // we do not currently index NULL, might be a TODO in the future
    if (geojson.properties && geojson.properties[property] !== undefined && geojson.properties[property] !== null) {
      index.index.remove(geojson.properties[property], geojson.id, callback);
    }
  }

  // add the geojson object to the store
  // calculate the envelope and add it to the rtree
  // should return a deferred
  GeoStore.prototype.add = function(geojson, callback){

    var bbox, sync, i, j, feature, self = this;

    if (!geojson.type.match(/Feature/)) {
      throw new Error("Terraform.GeoStore : only Features and FeatureCollections are supported");
    }

    if(geojson.type === "Feature" && !geojson.id) {
      throw new Error("Terraform.GeoStore : Feature does not have an id property");
    }

    // set a bounding box
    if(geojson.type === "FeatureCollection"){
      for (i = 0; i < geojson.features.length; i++) {
        feature = geojson.features[i];
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
      if (this._additional_indexes && this._additional_indexes.length) {
        sync = new Sync();

        for (i = 0; i < geojson.features.length; i++) {
          feature = geojson.features[i];

          for (j = 0; j < this._additional_indexes.length; j++) {
            sync.next(checkIndexAndAdd, this._additional_indexes[j], feature);
          }
        }

        sync.start(function () {
          self.store.add(geojson, callback);
        });
      } else {
        this.store.add(geojson, callback);
      }
    } else {
      bbox = Terraformer.Tools.calculateBounds(geojson);
      // TODO: if we want to be atomic and consistent, this should be truly synchronous
      this.index.insert({
        x: bbox[0],
        y: bbox[1],
        w: Math.abs(bbox[0] - bbox[2]),
        h: Math.abs(bbox[1] - bbox[3])
      }, geojson.id);

      // check for additional indexes and add to them if there are property matches
      if (this._additional_indexes && this._additional_indexes.length) {
        sync = new Sync();

        for (j = 0; j < this._additional_indexes.length; j++) {
          sync.next(checkIndexAndAdd, this._additional_indexes[j], geojson);
        }

        sync.start(function () {
          self.store.add(geojson, callback);
        });
      } else {
        this.store.add(geojson, callback);
      }
    }

    // store the data (use the stores store method to decide how to do this.)
  };

  GeoStore.prototype.remove = function(id, callback){
    this.get(id, bind(this, function(error, geojson){
      if ( error ){
        callback("Could not get feature to remove", null);
      } else {
        this.index.remove(geojson, id, bind(this, function(error, leaf){
          if(error){
            callback("Could not remove from index", null);
          } else {
            //this.store.remove(id, callback);
            // check for additional indexes and add to them if there are property matches
            if (this._additional_indexes && this._additional_indexes.length) {
              sync = new Sync();

              for (j = 0; j < this._additional_indexes.length; j++) {
                sync.next(checkIndexAndRemove, this._additional_indexes[j], geojson);
              }

              sync.start(function () {
                self.store.remove(id, callback);
              });
            } else {
              this.store.remove(id, callback);
            }
          }
        }));
      }
    }));
  };

  GeoStore.prototype.contains = function(geojson){
    var args = Array.prototype.slice.call(arguments);
    args.shift();

    var callback = args.pop();
    if (args.length) {
      var indexQuery = args[0];
    }


    // make a new deferred
    var shape = new Terraformer.Primitive(geojson);

    // create our envelope
    var envelope = Terraformer.Tools.calculateEnvelope(shape);

    // search the index
    this.index.search(envelope, bind(this, function(err, found){
      var results = [];
      var completed = 0;
      var errors = 0;
      var self = this;
      var sync = new Sync();
      var set;
      var i;

      // should we do set elimination with additional indexes?
      if (indexQuery && self._additional_indexes.length) {
        // convert "found" to an object with keys
        set = { };

        for (i = 0; i < found.length; i++) {
          set[found[i]] = true;
        }

        // iterate through the queries, find the correct indexes, and apply them
        var keys = Object.keys(indexQuery);

        for (var j = 0; j < keys.length; j++) {
          for (i = 0; i < self._additional_indexes.length; i++) {
            // index property matches query
            if (self._additional_indexes[i].property === keys[j]) {
              var which = indexQuery[keys[j]], index = self._additional_indexes[i].index;

              sync.next(function (index, which, set, id) {
                var next = this;
                eliminateForIndex(index, which, set, function (err, newSet) {
                  set = newSet;
                  next.done(err);
                });
              }, index, which, set);
            }
          }
        }

      }

      sync.start(function () {
        // if we have a set, it is our new "found"
        if (set) {
          found = Object.keys(set);
        }

        // the function to evalute results from the index
        var evaluate = function(primitive){
          completed++;
          if ( primitive ){
            var geometry = new Terraformer.Primitive(primitive.geometry);

            if (shape.within(geometry)){
              if (self._stream) {
                if (completed === found.length) {
                  self._stream.emit("end", primitive);
                } else {
                  self._stream.emit("data", primitive);
                }
              } else {
                results.push(primitive);
              }
            }

            if(completed >= found.length){
              if(!errors){
                if (self._stream) {
                  self._stream = null;
                } else if (callback) {
                  callback( null, results );
                }
              } else {
                if (callback) {
                  callback("Could not get all geometries", null);
                }
              }
            }
          }
        };

        var error = function(){
          completed++;
          errors++;
          if(completed >= found.length){
            if (callback) {
              callback("Could not get all geometries", null);
            }
          }
        };

        // for each result see if the polygon contains the point
        if(found && found.length){
          var getCB = function(err, result){
            if (err) {
              error();
            } else {
              evaluate( result );
            }
          };

          for (var i = 0; i < found.length; i++) {
            self.get(found[i], getCB);
          }
        } else {
          if (callback) {
            callback(null, results);
          }
        }
      });

    }));
  };

  GeoStore.prototype.within = function(geojson){
    var args = Array.prototype.slice.call(arguments);
    args.shift();

    var callback = args.pop();
    if (args.length) {
      var indexQuery = args[0];
    }

    // make a new deferred
    var shape = new Terraformer.Primitive(geojson);

    // create our envelope
    var envelope = Terraformer.Tools.calculateEnvelope(shape);

    // search the index using within
    this.index.within(envelope, bind(this, function(err, found){
      var results = [];
      var completed = 0;
      var errors = 0;
      var self = this;
      var sync = new Sync();
      var set;
      var i;

      // should we do set elimination with additional indexes?
      if (indexQuery && self._additional_indexes.length) {
        // convert "found" to an object with keys
        set = { };

        for (i = 0; i < found.length; i++) {
          set[found[i]] = true;
        }

        // iterate through the queries, find the correct indexes, and apply them
        var keys = Object.keys(indexQuery);

        for (var j = 0; j < keys.length; j++) {
          for (i = 0; i < self._additional_indexes.length; i++) {
            // index property matches query
            if (self._additional_indexes[i].property === keys[j]) {
              var which = indexQuery[keys[j]], index = self._additional_indexes[i].index;

              sync.next(function (index, which, set, id) {
                var next = this;
                eliminateForIndex(index, which, set, function (err, newSet) {
                  set = newSet;
                  next.done(err);
                });
              }, index, which, set);
            }
          }
        }

      }

      sync.start(function () {
        // if we have a set, it is our new "found"
        if (set) {
          found = Object.keys(set);
        }

        // the function to evalute results from the index
        var evaluate = function(primitive){
          completed++;
          if ( primitive ){
            var geometry = new Terraformer.Primitive(primitive.geometry);

            if (geometry.within(shape)){
              if (self._stream) {
                if (completed === found.length) {
                  self._stream.emit("end", primitive);
                } else {
                  self._stream.emit("data", primitive);
                }
              } else {
                results.push(primitive);
              }
            }

            if(completed >= found.length){
              if(!errors){
                if (self._stream) {
                  self._stream = null;
                } else if (callback) {
                  callback( null, results );
                }
              } else {
                if (callback) {
                  callback("Could not get all geometries", null);
                }
              }
            }
          }
        };

        var error = function(){
          completed++;
          errors++;
          if(completed >= found.length){
            if (callback) {
              callback("Could not get all geometries", null);
            }
          }
        };

        // for each result see if the polygon contains the point
        if(found && found.length){
          var getCB = function(err, result){
            if (err) {
              error();
            } else {
              evaluate( result );
            }
          };

          for (var i = 0; i < found.length; i++) {
            self.get(found[i], getCB);
          }
        } else {
          if (callback) {
            callback(null, results);
          }
        }
      });

    }));

  };

  GeoStore.prototype.update = function(geojson, callback){
    var feature = Terraformer.Primitive(geojson);

    if (feature.type !== "Feature") {
      throw new Error("Terraform.GeoStore : only Features and FeatureCollections are supported");
    }

    if(!feature.id) {
      throw new Error("Terraform.GeoStore : Feature does not have an id property");
    }

    this.get(feature.id, bind(this, function( error, oldFeatureGeoJSON ){
      if ( error ){
        callback("Could find feature", null);
      } else {
        var oldFeature = new Terraformer.Primitive(oldFeatureGeoJSON);
        this.index.remove(oldFeature.envelope(), oldFeature.id);
        this.index.insert(feature.envelope(), feature.id);
        this.store.update(feature, callback);
      }
    }));

  };

  // gets an item by id
  GeoStore.prototype.get = function(id, callback){
    this.store.get( id, callback );
  };

  GeoStore.prototype.createReadStream = function () {
    this._stream = new Stream();
    return this._stream;
  };

  // add an index
  GeoStore.prototype.addIndex = function(index) {
    this._additional_indexes.push(index);
  };


  /*
    "crime":
    {
      "equals": "arson"
    }

    index -> specific index that references the property keyword
    query -> object containing the specific queries for the index
    set -> object containing keys of all of the id's matching currently

    callback -> object containing keys of all of the id's still matching:
    {
      1: true,
      23: true
    }

    TODO: add functionality for
    "crime":
    {
      "or": {
        "equals": "arson",
        "equals": "theft"
      }
    }
   */
  function eliminateForIndex(index, query, set, callback) {
    var queryKeys = Object.keys(query);
    var count = 0;

    for (var i = 0; i < queryKeys.length; i++) {
      if (typeof index[queryKeys[i]] !== "function") {
        callback("Index does not have a method matching " + queryKeys[i]);
        return;
      }

      index[queryKeys[i]](query[i], function (err, data) {
        count++;

        if (err) {
          callback(err);

          // short-circuit the scan, we hit an error. this is fatal.
          count = queryKeys.length;
          return;
        } else {
          var setKeys = Object.keys(set);
          for (var j = 0; j < setKeys.length; j++) {
            if (!data[setKeys[j]]) {
              delete set[setKeys[j]];
            }
          }
        }

        if (count === queryKeys.length) {
          callback(null, set);
        }
      });
    }
  }

  exports.GeoStore = GeoStore;

  return exports;


}));
