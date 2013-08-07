var vows    = require('vows'),
    assert  = require('assert'),
    wkt     = require('../terraformer-wkt-parser');

var fs = require('fs');

var util = require('util');

var point      = fs.readFileSync('./examples/point.wkt', 'utf8'),
    linestring = fs.readFileSync('./examples/linestring.wkt', 'utf8'),
    polygon    = fs.readFileSync('./examples/polygon.wkt', 'utf8'),
    polyh      = fs.readFileSync('./examples/polygon_with_hole.wkt', 'utf8'),
    multipoint = fs.readFileSync('./examples/multipoint.wkt', 'utf8'),
    multi_a    = fs.readFileSync('./examples/multipoint_alternate.wkt', 'utf8'),
    multi_ls   = fs.readFileSync('./examples/multi_linestring.wkt', 'utf8'),
    multi_p    = fs.readFileSync('./examples/multi_polygon.wkt', 'utf8'),
    multi_p_h  = fs.readFileSync('./examples/multi_polygon_with_hole.wkt', 'utf8');


vows.describe('Terraformer Parsing').addBatch({
  'Given a Point': {
    topic: function () {
      return wkt.parse(point);
    },
    'the point should be correctly converted to Terraformer Primitive': function (topic) {
      assert.equal(topic.type, "Point");
    }
  },
  'Given a LineString': {
    topic: function () {
      return wkt.parse(linestring);
    },
    'the point should be correctly converted to Terraformer Primitive': function (topic) {
      assert.equal(topic.type, "LineString");
    }
  },
  'Given a Polygon': {
    topic: function () {
      return wkt.parse(polygon);
    },
    'the point should be correctly converted to Terraformer Primitive': function (topic) {
      assert.equal(topic.type, "Polygon");
    }
  },
  'Given a Polygon with a Hole': {
    topic: function () {
      return wkt.parse(polyh);
    },
    'the point should be correctly converted to Terraformer Primitive': function (topic) {
      assert.equal(topic.type, "Polygon");
    }
  },
  'Given a MultiPoint': {
    topic: function () {
      return wkt.parse(multipoint);
    },
    'the point should be correctly converted to Terraformer Primitive': function (topic) {
      assert.equal(topic.type, "MultiPoint");
    }
  },
  'Given a MultiPoint with Alternate Syntax': {
    topic: function () {
      return wkt.parse(multi_a);
    },
    'the point should be correctly converted to Terraformer Primitive': function (topic) {
      assert.equal(topic.type, "MultiPoint");
    }
  },
  'Given a MultiLineString': {
    topic: function () {
      return wkt.parse(multi_ls);
    },
    'the point should be correctly converted to Terraformer Primitive': function (topic) {
      assert.equal(topic.type, "MultiLineString");
    }
  },
  'Given a MultiPolygon': {
    topic: function () {
      return wkt.parse(multi_p);
    },
    'the point should be correctly converted to Terraformer Primitive': function (topic) {
      assert.equal(topic.type, "MultiPolygon");
    }
  },
  'Given a MultiPolygon with a Hole': {
    topic: function () {
      return wkt.parse(multi_p_h);
    },
    'the point should be correctly converted to Terraformer Primitive': function (topic) {
      assert.equal(topic.type, "MultiPolygon");
    }
  }
}).export(module);
