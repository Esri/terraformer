(function (root, factory) {

  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    exports = module.exports = factory(require("terraformer"));
  }

  if(typeof root.navigator === "object") {
    if (!root.Terraformer){
      throw new Error("Terraformer.RTree requires the core Terraformer library. https://github.com/esri/Terraformer");
    }
    root.Terraformer.RTree = factory(root.Terraformer).RTree;
  }

}(this, function(Terraformer) {
  var exports = { };

  function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

  "SOURCE";

  exports.RTree = RTree;

  return exports;
}));