var vows    = require('vows'),
    assert  = require('assert'),
    arcgis  = require('../index');

vows.describe('ArcGIS').addBatch({
  'When Converting a GeoJSON Point to an ArcGIS Point': {
    topic: function () {
      var input = {
        "type": "Point",
        "coordinates": [-58.7109375,47.4609375]
      };

      return arcgis.convert(input);
    },
    'it should convert correctly': function (topic) {
      var expect = {
        "x":-58.7109375,
        "y":47.4609375,
        "spatialReference": {
          "wkid":4326
        }
      };

      assert.deepEqual(topic, expect, 'GeoJSON is correct');
    }
  },
  'When Converting a GeoJSON LinesString to an ArcGIS Polyline': {
    topic: function () {
      var input = {
        "type": "LineString",
        "coordinates": [ [21.4453125,-14.0625],[33.3984375,-20.7421875],[38.3203125,-24.609375] ]
      };

      return arcgis.convert(input);
    },
    'it should convert correctly': function (topic) {
      var expect = {
        "paths":[
          [ [21.4453125,-14.0625],[33.3984375,-20.7421875],[38.3203125,-24.609375] ]
        ],
        "spatialReference":{
          "wkid":4326
        }
      };

      assert.deepEqual(topic, expect, 'GeoJSON is correct');
    }
  },
  'When Converting a GeoJSON Polygon to an ArcGIS Polygon': {
    topic: function () {
      var input = {
        "type": "Polygon",
        "coordinates": [
          [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
        ]
      };

      return arcgis.convert(input);
    },
    'it should convert correctly': function (topic) {
      var expect = {
        "rings":[
          [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
        ],
        "spatialReference":{
          "wkid":4326
        }
      };

      assert.deepEqual(topic, expect, 'GeoJSON is correct');
    }
  },
  'When Converting a GeoJSON Polygon with a Hole to ArcGIS': {
    topic: function () {
      var input = {
        "type": "Polygon",
        "coordinates": [
          [ [100.0,0.0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0] ],
          [ [100.2,0.2],[100.8,0.2],[100.8,0.8],[100.2,0.8],[100.2,0.2] ]
        ]
      };

      return arcgis.convert(input);
    },
    'it should convert correctly': function (topic) {
      var expect = {
        "rings": [
          [ [100.0,0.0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0] ],
          [ [100.2,0.2],[100.8,0.2],[100.8,0.8],[100.2,0.8],[100.2,0.2] ]
        ],
        "spatialReference":{
          "wkid":4326
        }
      };

      assert.deepEqual(topic, expect, 'GeoJSON is correct');
    }
  },
  'When Converting a GeoJSON MultiPoint to an ArcGIS Multipoint': {
    topic: function () {
      var input = {
        "type": "MultiPoint",
        "coordinates": [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625] ]
      };

      return arcgis.convert(input);
    },
    'it should convert correctly': function (topic) {
      var expect = {
        "points":[ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625] ],
        "spatialReference":{
          "wkid":4326
        }
      };

      assert.deepEqual(topic, expect, 'GeoJSON is correct');
    }
  },
  'When Converting a GeoJSON MultiLineString to an ArcGIS MultiLineString': {
    topic: function () {
      var input = {
        "type": "MultiLineString",
        "coordinates": [
          [ [41.8359375,71.015625],[56.953125,33.75] ],
          [ [21.796875,36.5625],[47.8359375,71.015625] ]
        ]
      };

      return arcgis.convert(input);
    },
    'it should convert correctly': function (topic) {
      var expect = {
        "paths":[
          [ [41.8359375,71.015625],[56.953125,33.75] ],
          [ [21.796875,36.5625],[47.8359375,71.015625] ]
        ],
        "spatialReference":{
          "wkid":4326
        }
      };

      assert.deepEqual(topic, expect, 'GeoJSON is correct');
    }
  },
  'When Converting a GeoJSON MultiPolygon to an ArcGIS MultiPolygon': {
    topic: function () {
      var input = {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0] ]
          ],
          [
            [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
          ]
        ]
      };

      return arcgis.convert(input);
    },
    'it should convert correctly': function (topic) {
      var expect = {
        "rings":[
          [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0] ],
          [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
        ],
        "spatialReference": {
          "wkid":4326
        }
      };

      assert.deepEqual(topic, expect, 'GeoJSON is correct');
    }
  },
  'When Converting a GeoJSON MultiPolygon with Holes to an ArcGIS MultiPolygon': {
    topic: function () {
      var input = {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0] ]
          ],
          [
            [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
            [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
          ]
        ]
      };

      return arcgis.convert(input);
    },
    'it should convert correctly': function (topic) {
      var expect = {
        "rings":[
          [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0] ],
          [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
          [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
        ],
        "spatialReference": {
          "wkid":4326
        }
      };

      assert.deepEqual(topic, expect, 'GeoJSON is correct');
    }
  },
  'When Converting an ArcGIS Point to Primitive': {
    topic: function () {
      var input = {
        "x": -66.796875,
        "y": 20.0390625,
        "spatialReference": {
          "wkid": 4326
        }
      };

      return arcgis.parse(input);
    },
    'it should convert correctly': function (topic) {
      assert.deepEqual(topic.coordinates, [-66.796875, 20.0390625]);
    }
  },
  'When Converting an ArcGIS Polyline to Primitive': {
    topic: function () {
      var input = {
        "paths": [
          [ [6.6796875,47.8125],[-65.390625,52.3828125],[-52.3828125,42.5390625] ]
        ],
        "spatialReference": {
          "wkid": 4326
        }
      };

      return arcgis.parse(input);
    },
    'it should convert correctly': function (topic) {
      assert.deepEqual(topic.coordinates, [ [6.6796875,47.8125],[-65.390625,52.3828125],[-52.3828125,42.5390625] ]);
    }
  },
  'When Converting an ArcGIS Polygon to Primitive': {
    topic: function () {
      var input = {
        "rings": [
          [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
        ],
        "spatialReference": {
          "wkid": 4326
        }
      };

      return arcgis.parse(input);
    },
    'it should convert correctly': function (topic) {
      assert.deepEqual(topic.coordinates, [[ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]]);
    }
  },
  'When Converting an ArcGIS MultiPoint to Primitive': {
    topic: function () {
      var input = {
        "points":[ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625] ],
        "spatialReference":{
          "wkid":4326
        }
      };

      return arcgis.parse(input);
    },
    'it should convert correctly': function (topic) {
      assert.deepEqual(topic.coordinates, [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625] ]);
    }
  },
  'When Converting a Different ArcGIS Polygon to Primitive': {
    topic: function () {
      var input = {
        "rings":[
          [[-122.63,45.52],[-122.57,45.53],[-122.52,45.50],[-122.49,45.48],[-122.64,45.49],[-122.63,45.52],[-122.63,45.52]],
          [[-83,35],[-74,35],[-74,41],[-83,41],[-83,35]]
        ],
        "spatialReference": {
          "wkid":4326
        }
      };

      return arcgis.parse(input);
    },
    'it should convert correctly': function (topic) {
      assert.deepEqual(topic.coordinates, [[ [-122.63,45.52],[-122.57,45.53],[-122.52,45.50],[-122.49,45.48],[-122.64,45.49],[-122.63,45.52],[-122.63,45.52] ],[ [-83,35],[-74,35],[-74,41],[-83,41],[-83,35] ]]);
    }
  }
}).export(module);
