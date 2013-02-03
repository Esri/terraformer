# Terraformer RTree

This package is part of the [Terraformer](https://github.com/Geoloqi/Terraformer) project.

A simple RTree implementation based off of `rtree.js`.  Uses `envelopes` to search: a match is `envelope` to `envelope`, not with `polygon` matching.  It is then up to the user to determine whether the `polygon` is contained or intersects with the result returned.

## Installing

    $ npm install terraformer-rtree 

## Usage

    var rtree = require('terraformer-rtree');
    
    var tree = new rtree.RTree();
    tree.insert({ x: 10, y: 10, w: 10, h: 10 }, 'good');
    
    // should return [ 'good' ]
    tree.search({ x: 15, y: 15, w: 0, h: 0 }, function (results) {
      // should return [ 'good' ]
    });

## API Reference

```javascript
new RTree()

// instance methods
insert(envelope, obj) // insert an envelope and an object
remove(envelope, obj) // remove an envelope and an object
search(envelope, callback) // find all envelopes that could contain this envelope, returns an array
serialize() // returns a JSON representation of the tree
deserialize(json) // sets the tree from a JSON representation
```
