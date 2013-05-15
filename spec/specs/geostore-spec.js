if(typeof module === "object"){
 var Terraformer = require("../../dist/node/terraformer.js");
 Terraformer.RTree = require("../../dist/node/RTree/index.js").RTree;
 Terraformer.Stores = {};
 Terraformer.Stores.Memory = require("../../src/Stores/Memory.js");
 Terraformer.Stores.LocalStorage = require("../../src/Stores/LocalStorage.js");
 Terraformer.Geostore = require("../../src/geostore.js");
}