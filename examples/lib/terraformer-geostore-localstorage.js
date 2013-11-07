(function (root, factory) {
  // Browser Global.
  if(typeof root.navigator === "object") {
    if (!root.Terraformer){
      throw new Error("Terraformer.GeoStore.LocalStorage requires the core Terraformer library. https://github.com/esri/Terraformer");
    }
    if (!root.Terraformer.GeoStore){
      throw new Error("Terraformer.GeoStore.LocalStorage requires the Terraformer GeoStore library. https://github.com/esri/terraformer-geostore");
    }
    root.Terraformer.GeoStore.LocalStorage = factory(root.Terraformer).LocalStorage;
  }
}(this, function() {
  var exports = { };

  var callback;

  // These methods get called in context of the geostore
  function LocalStorage(){
    var opts = arguments[0] || {};
    this._key = opts.key || "_terraformer";
  }

  // store the data at id returns true if stored successfully
  LocalStorage.prototype.add = function(geojson, callback){
    if(geojson.type === "FeatureCollection"){
      for (var i = 0; i < geojson.features.length; i++) {
        this.set(geojson.features[i]);
      }
    } else {
      this.set(geojson);
    }
    if (callback) {
      callback( null, geojson );
    }
  };

  LocalStorage.prototype.key = function(id){
    return this._key +"_"+id;
  };

  // remove the data from the index and data with id returns true if removed successfully.
  LocalStorage.prototype.remove = function( id, callback ){
    localStorage.removeItem( this.key( id ) );
    if (callback) {
      callback( null, id );
    }
  };

  // return the data stored at id
  LocalStorage.prototype.get = function(id, callback){
    if (callback) {
      callback( null, JSON.parse(localStorage.getItem(this.key(id))));
    }
  };

  LocalStorage.prototype.set = function(feature){
    localStorage.setItem(this.key(feature.id), JSON.stringify(feature));
  };

  LocalStorage.prototype.update = function(geojson, callback){
    this.set(geojson);
    if (callback) {
      callback( null, geojson );
    }
  };

  LocalStorage.prototype.serialize = function(callback){
    var objs = [];

    for (var key in localStorage){
      if(key.match(this._key)){
        objs.push(JSON.parse(localStorage.getItem(key)));
      }
    }

    if (callback) {
      callback(null, JSON.stringify(objs));
    }
  };

  LocalStorage.prototype.deserialize = function(serial, callback){
    var data = JSON.parse(serial);
    for (var i = data.length - 1; i >= 0; i--) {
      this.set(data[i]);
    }

    if (callback) {
      callback();
    }
  };

  exports.LocalStorage = LocalStorage;

  return exports;
}));
