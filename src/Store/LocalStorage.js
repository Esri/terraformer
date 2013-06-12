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
    var exports = {};
    for(var feature in localStorage){
      if(feature.match(this._key)){
        exports[feature] = localStorage[feature];
      }
    }
    return exports;
  };

  LocalStorage.prototype.serialize = function(callback){
    var objs = [];

    // make a new deferred
    var dfd = new Terraformer.Deferred();

    // map callback to dfd if we have one
    if(callback){
      dfd.then(function(result){
        callback(null, result);
      }, function(error){
        callback(error, null);
      });
    }

    for (var key in localStorage){
      if(key.match(this._key)){
        objs.push(localStorage.getItem(key));
      }
    }

    dfd.resolve(JSON.stringify(objs));

    return dfd;
  };

  LocalStorage.prototype.deserialize = function(serial){
    var data = JSON.parse(serial);
    for (var i = data.length - 1; i >= 0; i--) {
      this.set(data[i]);
    }
    return this;
  };

  exports.LocalStorage = LocalStorage;

  return exports;
}));