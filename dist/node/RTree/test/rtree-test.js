var vows    = require('vows'),
    assert  = require('assert'),
    rtree   = require('../index');

vows.describe('RTree').addBatch({
  'Given an RTree with 1 Entry and a Point that is Within that Entry': {
    topic: function () {
      var tree = new rtree.RTree();

      tree.insert({ x: 10, y: 10, w: 10, h: 10 }, 'good');

      return tree.search({ x: 15, y: 15, w: 0, h: 0 });
    },
    'the correct Entry is returned': function (topic) {
      assert.notEqual(topic, undefined, 'topic is not undefined');
      assert.equal(topic.length, 1, 'topic is an array of 1');
      assert.equal(topic[0], 'good', 'data is good');
    }
  },
  'Given an RTree with 1 Entry and a Point that is not Within That Entry': {
    topic: function () {
      var tree = new rtree.RTree();

      tree.insert({ x: 10, y: 10, w: 10, h: 10 }, 'bad');

      return tree.search({ x: 1, y: 1, w: 0, h: 0 });
    },
    'no Entry is returned': function (topic) {
      assert.notEqual(topic, undefined, 'topic is not undefined');
      assert.equal(topic.length, 0, 'topic is an array of 0');
    }
  },
  'Given an RTree with Multiple Entries and a Point that is Within One Entry': {
    topic: function () {
      var tree = new rtree.RTree();

      tree.insert({ x: 10, y: 10, w: 10, h: 10 }, 'good');
      tree.insert({ x: 100, y: 100, w: 10, h: 10 }, 'bad');

      return tree.search({ x: 15, y: 15, w: 0, h: 0 });
    },
    'the correct Entry is returned': function (topic) {
      assert.notEqual(topic, undefined, 'topic is not undefined');
      assert.equal(topic.length, 1, 'topic is an array of 1');
      assert.equal(topic[0], 'good', 'data is good');
    }
  },
  'When search is called with a callback': {
    topic: function () {
      var tree = new rtree.RTree();

      tree.insert({ x: 10, y: 10, w: 10, h: 10 }, 'good');
      tree.insert({ x: 100, y: 100, w: 10, h: 10 }, 'bad');

      tree.search({ x: 15, y: 15, w: 0, h: 0 }, this.callback);
    },
    'the correct Entry is returned': function (err, topic) {
      assert.notEqual(topic, undefined, 'topic is not undefined');
      assert.equal(topic.length, 1, 'topic is an array of 1');
      assert.equal(topic[0], 'good', 'data is good');
    }
  },
  'Given an RTree with Multiple Entries and a Point that is not Within Those Entries': {
    topic: function () {
      var tree = new rtree.RTree();

      tree.insert({ x: 10, y: 10, w: 10, h: 10 }, 'bad');
      tree.insert({ x: 100, y: 100, w: 10, h: 10 }, 'bad');

      return tree.search({ x: 1, y: 1, w: 0, h: 0 });
    },
    'no Entry is returned': function (topic) {
      assert.notEqual(topic, undefined, 'topic is not undefined');
      assert.equal(topic.length, 0, 'topic is an array of 0');
    }
  },
  'When Removing an Entry That Matches': {
    topic: function () {
      var tree = new rtree.RTree();

      tree.insert({ x: 10, y: 10, w: 10, h: 10 }, 'good');
      tree.insert({ x: 100, y: 100, w: 10, h: 10 }, 'bad');

      tree.remove({ x: 10, y: 10, w: 10, h: 10 });

      return tree.search({ x: 15, y: 15, w: 0, h: 0 });
    },
    'no Entry is returned': function (topic) {
      assert.notEqual(topic, undefined, 'topic is not undefined');
      assert.equal(topic.length, 0, 'topic is an array of 0');
    }
  },
  'When Calling serialize()': {
    topic: function () {
      var tree = new rtree.RTree();

      tree.insert({ x: 10, y: 10, w: 10, h: 10 }, 'foo');
      tree.insert({ x: 100, y: 100, w: 10, h: 10 }, 'bar');

      return tree.serialize();
    },
    'a Tree is returned': function (topic) {
      var inner = {
        x: 10,
        y: 10,
        w: 100,
        h: 100,
        id: 'root',
        nodes: [
          {
            x: 10,
            y: 10,
            w: 10,
            h: 10,
            leaf: 'foo'
          },
          {
            x: 100,
            y: 100,
            w: 10,
            h: 10,
            leaf: 'bar'
          }
        ]
      };

      assert.deepEqual(topic, inner, 'the correct JSON is generated');
    }
  },
  'When a Tree is Set via deserialize() and a searc() Occurs': {
    topic: function () {
      var inner = {
        x: 10,
        y: 10,
        w: 100,
        h: 100,
        id: 'root',
        nodes: [
          {
            x: 10,
            y: 10,
            w: 10,
            h: 10,
            leaf: 'good'
          },
          {
            x: 100,
            y: 100,
            w: 10,
            h: 10,
            leaf: 'bad'
          }
        ]
      };

      var tree = new rtree.RTree();

      tree.deserialize(inner);

      return tree.search({ x: 15, y: 15, w: 0, h: 0 });
    },
    'the correct entry is returned': function (topic) {
      assert.notEqual(topic, undefined, 'topic is not undefined');
      assert.equal(topic.length, 1, 'topic is an array of 1');
      assert.equal(topic[0], 'good', 'data is good');
    }
  },

}).export(module);
