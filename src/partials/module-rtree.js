(function (root, factory) {

  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    exports = module.exports = factory();
  }

  // AMD.
  if(typeof define === 'function' && define.amd) {
    define(factory);
  }

  // Browser Global.
  if(typeof window === "object") {
    console.log("Browser");
    console.log(factory());
    if (typeof root.Terraformer === "undefined"){
      root.Terraformer = {};
    }
    root.Terraformer.RTree = factory().RTree;
  }

}(this, function() {
  var exports = { };
  var Terraformer;

  // Local Reference To Browser Global
  if(typeof this.navigator === "object") {
    Terraformer = this.Terraformer;
  }

  "SOURCE";

  exports.RTree = RTree;

  return exports;
}));