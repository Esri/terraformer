(function (root, factory) {
  // AMD.
  if(typeof define === 'function' && define.amd) {
    define([], factory);
  }

  // Browser Global.
  if(typeof root.navigator === "object") {
    if(typeof root.Terraformer === "undefined"){
      root.Terraformer = {};
    }
    if(typeof root.Terraformer.Store === "undefined"){
      root.Terraformer.Store = {};
    }
    root.Terraformer.Store.LocalStorage = factory().LocalStorage;
  }
}(this, function() {
  var exports = { };

  // if we are in AMD terraformer core got passed in as our first requirement so we should set it.
  if(arguments[0] && typeof define === 'function' && define.amd) {
    this.Terraformer = arguments[0];
  }

  // These methods get called in context of the geostore
  function LocalStorage(){
    var opts = arguments[0] || {};
    this._key = opts.key || "_terraformer";
  }

  // store the data at id returns true if stored successfully
  LocalStorage.prototype.add = function(geojson, dfd){
    if(geojson.type === "FeatureCollection"){
      for (var i = 0; i < geojson.features.length; i++) {
        this.set(geojson.features[i]);
      }
    } else {
      this.set(geojson);
    }
    dfd.resolve(geojson);
    return dfd;
  };

  LocalStorage.prototype.key = function(id){
    return this._key +"_"+id;
  };

  // remove the data from the index and data with id returns true if removed successfully.
  LocalStorage.prototype.remove = function(id, dfd){
    localStorage.removeItem(this.key(id));
    dfd.resolve();
    return dfd;
  };

  // return the data stored at id
  LocalStorage.prototype.get = function(id, dfd){
    dfd.resolve(JSON.parse(localStorage.getItem(this.key(id))));
    return dfd;
  };

  LocalStorage.prototype.set = function(feature){
    localStorage.setItem(this.key(feature.id), JSON.stringify(feature));
  };

  LocalStorage.prototype.update = function(geojson, dfd){
    this.set(geojson);
    dfd.resolve(geojson);
    return dfd;
  };

  LocalStorage.prototype.toJSON = function(){
    var matcher = new RegExp("^"+this._key);
    var exports = {};
    for(var feature in localStorage){
      if(feature.match(matcher)){
        exports[feature] = localStorage[feature];
      }
    }
    return exports;
  };

  LocalStorage.prototype.serialize = function(callback){
    var objs = [];

    // make a new deferred
    var dfd = new this.deferred();

    // map callback to dfd if we have one
    if(callback){
      dfd.then(function(result){
        callback(null, result);
      }, function(error){
        callback(error, null);
      });
    }

    for (var key in localStorage){
      if(key.match(this.key)){
        objs.push(localStorage.getItem(key));
      }
    }
    dfd.resolve(JSON.stringify(objs));
    return ;
  };

  LocalStorage.prototype.deserialize = function(serial, callback){
    var data = JSON.parse(serial);

    // make a new deferred
    var dfd = new this.deferred();

    // map callback to dfd if we have one
    if(callback){
      dfd.then(function(result){
        callback(null, result);
      }, function(error){
        callback(error, null);
      });
    }

    for (var i = data.length - 1; i >= 0; i--) {
      this.set(data[i]);
    }

    dfd.resolve(this);

    return dfd;
  };

  exports.LocalStorage = LocalStorage;

  return exports;
}));