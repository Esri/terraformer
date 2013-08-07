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
    multi_p_h  = fs.readFileSync('./examples/multi_polygon_with_hole.wkt', 'utf8'),
    poly_dots  = fs.readFileSync('./examples/polygon_with_dots.wkt', 'utf8');



vows.describe('WKT Parsing').addBatch({
  'Given a Point': {
    topic: function () {
      return wkt.parse(point);
    },
    'the point should be correctly converted to Loqi-GeoJSON internally': function (topic) {
      assert.equal(topic.type, "Point");
      assert.equal(topic.coordinates.length, 2);
      assert.equal(topic.coordinates[0], 30);
      assert.equal(topic.coordinates[1], 10);
    }
  },
  'Given an Empty Point': {
    topic: function () {
      return wkt.parse("POINT EMPTY");
    },
    'the point should be correctly converted to Loqi-GeoJSON internally': function (topic) {
      assert.equal(topic.type, "Point");
      assert.equal(topic.coordinates.length, 0);
    }
  },
  'Given a LineString': {
    topic: function () {
      return wkt.parse(linestring);
    },
    'the point should be correctly converted to Loqi-GeoJSON internally': function (topic) {
      assert.equal(topic.type, "LineString");
      assert.equal(topic.coordinates.length, 3);
      assert.equal(topic.coordinates[0][0], 30);
      assert.equal(topic.coordinates[0][1], 10);
      assert.equal(topic.coordinates[1][0], 10);
      assert.equal(topic.coordinates[1][1], 30);
      assert.equal(topic.coordinates[2][0], 40);
      assert.equal(topic.coordinates[2][1], 40);
    }
  },
  'Given an Empty LineString': {
    topic: function () {
      return wkt.parse("LINESTRING EMPTY");
    },
    'the point should be correctly converted to Loqi-GeoJSON internally': function (topic) {
      assert.equal(topic.type, "LineString");
      assert.equal(topic.coordinates.length, 0);
    }
  },
  'Given a Polygon': {
    topic: function () {
      return wkt.parse(polygon);
    },
    'the point should be correctly converted to Loqi-GeoJSON internally': function (topic) {
      assert.equal(topic.type, "Polygon");
      assert.equal(topic.coordinates.length, 1);
      assert.equal(topic.coordinates[0][0][0], 30);
      assert.equal(topic.coordinates[0][0][1], 10);
      assert.equal(topic.coordinates[0][1][0], 10);
      assert.equal(topic.coordinates[0][1][1], 20);
      assert.equal(topic.coordinates[0][2][0], 20);
      assert.equal(topic.coordinates[0][2][1], 40);
      assert.equal(topic.coordinates[0][3][0], 40);
      assert.equal(topic.coordinates[0][3][1], 40);
      assert.equal(topic.coordinates[0][4][0], 30);
      assert.equal(topic.coordinates[0][4][1], 10);
    }
  },
  'Given a Polygon with Dots': {
    topic: function () {
      return wkt.parse(poly_dots);
    },
    'the point should be correctly converted to Loqi-GeoJSON internally': function (topic) {
    //-122.358 47.653,-122.348 47.649,-122.348 47.658,-122.358 47.658,-122.358 47.653
      assert.equal(topic.type, "Polygon");
      assert.equal(topic.coordinates.length, 1);
      assert.equal(topic.coordinates[0][0][0], -122.358);
      assert.equal(topic.coordinates[0][0][1], 47.653);
      assert.equal(topic.coordinates[0][1][0], -122.348);
      assert.equal(topic.coordinates[0][1][1], 47.649);
      assert.equal(topic.coordinates[0][2][0], -122.348);
      assert.equal(topic.coordinates[0][2][1], 47.658);
      assert.equal(topic.coordinates[0][3][0], -122.358);
      assert.equal(topic.coordinates[0][3][1], 47.658);
      assert.equal(topic.coordinates[0][4][0], -122.358);
      assert.equal(topic.coordinates[0][4][1], 47.653);
    }
  },
  'Given an Empty Polygon': {
    topic: function () {
      return wkt.parse("POLYGON EMPTY");
    },
    'the point should be correctly converted to Loqi-GeoJSON internally': function (topic) {
      assert.equal(topic.type, "Polygon");
      assert.equal(topic.coordinates.length, 0);
    }
  },
  'Given a Polygon with a Hole': {
    topic: function () {
      return wkt.parse(polyh);
    },
    'the point should be correctly converted to Loqi-GeoJSON internally': function (topic) {
      assert.equal(topic.type, "Polygon");
      assert.equal(topic.coordinates.length, 2);
      assert.equal(topic.coordinates[0][0][0], 35);
      assert.equal(topic.coordinates[0][0][1], 10);
      assert.equal(topic.coordinates[0][1][0], 10);
      assert.equal(topic.coordinates[0][1][1], 20);
      assert.equal(topic.coordinates[0][2][0], 15);
      assert.equal(topic.coordinates[0][2][1], 40);
      assert.equal(topic.coordinates[0][3][0], 45);
      assert.equal(topic.coordinates[0][3][1], 45);
      assert.equal(topic.coordinates[0][4][0], 35);
      assert.equal(topic.coordinates[0][4][1], 10);
      assert.equal(topic.coordinates[1][0][0], 20);
      assert.equal(topic.coordinates[1][0][1], 30);
      assert.equal(topic.coordinates[1][1][0], 35);
      assert.equal(topic.coordinates[1][1][1], 35);
      assert.equal(topic.coordinates[1][2][0], 30);
      assert.equal(topic.coordinates[1][2][1], 20);
      assert.equal(topic.coordinates[1][3][0], 20);
      assert.equal(topic.coordinates[1][3][1], 30);
    }
  },
  'Given a MultiPoint': {
    topic: function () {
      return wkt.parse(multipoint);
    },
    'the point should be correctly converted to Loqi-GeoJSON internally': function (topic) {
      assert.equal(topic.type, "MultiPoint");
      assert.equal(topic.coordinates.length, 4);
      assert.equal(topic.coordinates[0][0], 10);
      assert.equal(topic.coordinates[0][1], 40);
      assert.equal(topic.coordinates[1][0], 40);
      assert.equal(topic.coordinates[1][1], 30);
      assert.equal(topic.coordinates[2][0], 20);
      assert.equal(topic.coordinates[2][1], 20);
      assert.equal(topic.coordinates[3][0], 30);
      assert.equal(topic.coordinates[3][1], 10);
    }
  },
  'Given an Empty MultiPoint': {
    topic: function () {
      return wkt.parse("MULTIPOINT EMPTY");
    },
    'the point should be correctly converted to Loqi-GeoJSON internally': function (topic) {
      assert.equal(topic.type, "MultiPoint");
      assert.equal(topic.coordinates.length, 0);
    }
  },
  'Given a MultiPoint with Alternate Syntax': {
    topic: function () {
      return wkt.parse(multi_a);
    },
    'the point should be correctly converted to Loqi-GeoJSON internally': function (topic) {
      assert.equal(topic.type, "MultiPoint");
      assert.equal(topic.coordinates.length, 4);
      assert.equal(topic.coordinates[0][0], 10);
      assert.equal(topic.coordinates[0][1], 40);
      assert.equal(topic.coordinates[1][0], 40);
      assert.equal(topic.coordinates[1][1], 30);
      assert.equal(topic.coordinates[2][0], 20);
      assert.equal(topic.coordinates[2][1], 20);
      assert.equal(topic.coordinates[3][0], 30);
      assert.equal(topic.coordinates[3][1], 10);
    }
  },
  'Given a MultiLineString': {
    topic: function () {
      return wkt.parse(multi_ls);
    },
    'the point should be correctly converted to Loqi-GeoJSON internally': function (topic) {
      assert.equal(topic.type, "MultiLineString");
      assert.equal(topic.coordinates.length, 2);
      assert.equal(topic.coordinates[0][0][0], 10);
      assert.equal(topic.coordinates[0][0][1], 10);
      assert.equal(topic.coordinates[0][1][0], 20);
      assert.equal(topic.coordinates[0][1][1], 20);
      assert.equal(topic.coordinates[0][2][0], 10);
      assert.equal(topic.coordinates[0][2][1], 40);
      assert.equal(topic.coordinates[1][0][0], 40);
      assert.equal(topic.coordinates[1][0][1], 40);
      assert.equal(topic.coordinates[1][1][0], 30);
      assert.equal(topic.coordinates[1][1][1], 30);
      assert.equal(topic.coordinates[1][2][0], 40);
      assert.equal(topic.coordinates[1][2][1], 20);
      assert.equal(topic.coordinates[1][3][0], 30);
      assert.equal(topic.coordinates[1][3][1], 10);
    }
  },
  'Given an Empty MultiLineString': {
    topic: function () {
      return wkt.parse("MULTILINESTRING EMPTY");
    },
    'the point should be correctly converted to Loqi-GeoJSON internally': function (topic) {
      assert.equal(topic.type, "MultiLineString");
      assert.equal(topic.coordinates.length, 0);
    }
  },
  'Given a MultiPolygon': {
    topic: function () {
      return wkt.parse(multi_p);
    },
    'the point should be correctly converted to Loqi-GeoJSON internally': function (topic) {
      assert.equal(topic.type, "MultiPolygon");
      assert.equal(topic.coordinates.length, 2);
      assert.equal(topic.coordinates[0][0][0][0], 30);
      assert.equal(topic.coordinates[0][0][0][1], 20);
      assert.equal(topic.coordinates[0][0][1][0], 10);
      assert.equal(topic.coordinates[0][0][1][1], 40);
      assert.equal(topic.coordinates[0][0][2][0], 45);
      assert.equal(topic.coordinates[0][0][2][1], 40);
      assert.equal(topic.coordinates[0][0][3][0], 30);
      assert.equal(topic.coordinates[0][0][3][1], 20);
      assert.equal(topic.coordinates[1][0][0][0], 15);
      assert.equal(topic.coordinates[1][0][0][1], 5);
      assert.equal(topic.coordinates[1][0][1][0], 40);
      assert.equal(topic.coordinates[1][0][1][1], 10);
      assert.equal(topic.coordinates[1][0][2][0], 10);
      assert.equal(topic.coordinates[1][0][2][1], 20);
      assert.equal(topic.coordinates[1][0][3][0], 5);
      assert.equal(topic.coordinates[1][0][3][1], 10);
      assert.equal(topic.coordinates[1][0][4][0], 15);
      assert.equal(topic.coordinates[1][0][4][1], 5);
    }
  },
  'Given a MultiPolygon with a Hole': {
    topic: function () {
      return wkt.parse(multi_p_h);
    },
    'the point should be correctly converted to Loqi-GeoJSON internally': function (topic) {
      assert.equal(topic.type, "MultiPolygon");
      assert.equal(topic.coordinates.length, 2);
      assert.equal(topic.coordinates[0][0][0][0], 40);
      assert.equal(topic.coordinates[0][0][0][1], 40);
      assert.equal(topic.coordinates[0][0][1][0], 20);
      assert.equal(topic.coordinates[0][0][1][1], 45);
      assert.equal(topic.coordinates[0][0][2][0], 45);
      assert.equal(topic.coordinates[0][0][2][1], 30);
      assert.equal(topic.coordinates[0][0][3][0], 40);
      assert.equal(topic.coordinates[0][0][3][1], 40);
      assert.equal(topic.coordinates[1][0][0][0], 20);
      assert.equal(topic.coordinates[1][0][0][1], 35);
      assert.equal(topic.coordinates[1][0][1][0], 45);
      assert.equal(topic.coordinates[1][0][1][1], 20);
      assert.equal(topic.coordinates[1][0][2][0], 30);
      assert.equal(topic.coordinates[1][0][2][1], 5);
      assert.equal(topic.coordinates[1][0][3][0], 10);
      assert.equal(topic.coordinates[1][0][3][1], 10);
      assert.equal(topic.coordinates[1][0][4][0], 10);
      assert.equal(topic.coordinates[1][0][4][1], 30);
      assert.equal(topic.coordinates[1][0][5][0], 20);
      assert.equal(topic.coordinates[1][0][5][1], 35);
      assert.equal(topic.coordinates[1][1][0][0], 30);
      assert.equal(topic.coordinates[1][1][0][1], 20);
      assert.equal(topic.coordinates[1][1][1][0], 20);
      assert.equal(topic.coordinates[1][1][1][1], 25);
      assert.equal(topic.coordinates[1][1][2][0], 20);
      assert.equal(topic.coordinates[1][1][2][1], 15);
      assert.equal(topic.coordinates[1][1][3][0], 30);
      assert.equal(topic.coordinates[1][1][3][1], 20);
    }
  },
  'Given an Empty MultiPolygon': {
    topic: function () {
      return wkt.parse("MULTIPOLYGON EMPTY");
    },
    'the point should be correctly converted to Loqi-GeoJSON internally': function (topic) {
      assert.equal(topic.type, "MultiPolygon");
      assert.equal(topic.coordinates.length, 0);
    }
  }
}).export(module);
