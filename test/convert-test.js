var vows    = require('vows'),
    assert  = require('assert'),
    wkt     = require('../terraformer-wkt-parser');


var point      = require('../examples/point.json');
    linestring = require('../examples/linestring.json'),
    polygon    = require('../examples/polygon.json'),
    poly_hole  = require('../examples/polygon_with_hole.json'),
    multipoint = require('../examples/multipoint.json'),
    multi_ls   = require('../examples/multi_linestring.json'),
    multi_p    = require('../examples/multi_polygon.json');



vows.describe('WKT Convert').addBatch({
  'Given a Point': {
    topic: function () {
      return wkt.convert(point);
    },
    'the point should be correctly converted to WKT': function (topic) {
      assert.equal(topic, "POINT (100 0)");
    }
  },
  'Given an Empty Point': {
    topic: function () {
      return wkt.convert({ type: "Point" });
    },
    'the point should be correctly converted to WKT': function (topic) {
      assert.equal(topic, "POINT EMPTY");
    }
  },
  'Given a LineString': {
    topic: function () {
      return wkt.convert(linestring);
    },
    'the linestring should be correctly converted to WKT': function (topic) {
      assert.equal(topic, "LINESTRING (100 0, 101 1)");
    }
  },
  'Given an Empty LineString': {
    topic: function () {
      return wkt.convert({ type: "LineString" });
    },
    'the linestring should be correctly converted to WKT': function (topic) {
      assert.equal(topic, "LINESTRING EMPTY");
    }
  },
  'Given a Polygon': {
    topic: function () {
      return wkt.convert(polygon);
    },
    'the polygon should be correctly converted to WKT': function (topic) {
      assert.equal(topic, "POLYGON ((100 0, 101 0, 101 1, 100 1, 100 0))");
    }
  },
  'Given a Polygon with a Hole': {
    topic: function () {
      return wkt.convert(poly_hole);
    },
    'the polygon should be correctly converted to WKT': function (topic) {
      assert.equal(topic, "POLYGON ((100 0, 101 0, 101 1, 100 1, 100 0), (100.2 0.2, 100.8 0.2, 100.8 0.8, 100.2 0.8, 100.2 0.2))");
    }
  },
  'Given an Empty Polygon': {
    topic: function () {
      return wkt.convert({ type: "Polygon" });
    },
    'the polygon should be correctly converted to WKT': function (topic) {
      assert.equal(topic, "POLYGON EMPTY");
    }
  },
  'Given a MultiPoint': {
    topic: function () {
      return wkt.convert(multipoint);
    },
    'the linestring should be correctly converted to WKT': function (topic) {
      assert.equal(topic, "MULTIPOINT (100 0, 101 1)");
    }
  },
  'Given an Empty MultiPoint': {
    topic: function () {
      return wkt.convert({ type: "MultiPoint" });
    },
    'the linestring should be correctly converted to WKT': function (topic) {
      assert.equal(topic, "MULTIPOINT EMPTY");
    }
  },
  'Given a MultiLineString': {
    topic: function () {
      return wkt.convert(multi_ls);
    },
    'the multilinestring should be correctly converted to WKT': function (topic) {
      assert.equal(topic, "MULTILINESTRING ((100 0, 101 1), (102 2, 103 3))");
    }
  },
  'Given an Empty MultiLineString': {
    topic: function () {
      return wkt.convert({ type: "MultiLineString" });
    },
    'the multilinestring should be correctly converted to WKT': function (topic) {
      assert.equal(topic, "MULTILINESTRING EMPTY");
    }
  },
  'Given a MultiPolygon': {
    topic: function () {
      return wkt.convert(multi_p);
    },
    'the multipolygon should be correctly converted to WKT': function (topic) {
      assert.equal(topic, "MULTIPOLYGON (((102 2, 103 2, 103 3, 102 3, 102 2)), ((100 0, 101 0, 101 1, 100 1, 100 0), (100.2 0.2, 100.8 0.2, 100.8 0.8, 100.2 0.8, 100.2 0.2)))");
    }
  },
  'Given an Empty MultiPolygon': {
    topic: function () {
      return wkt.convert({ type: "MultiPolygon" });
    },
    'the multipolygon should be correctly converted to WKT': function (topic) {
      assert.equal(topic, "MULTIPOLYGON EMPTY");
    }
  }
}).export(module);
