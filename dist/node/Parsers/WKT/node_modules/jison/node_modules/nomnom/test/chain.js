var nomnom = require('../nomnom'),
    assert = require('assert');

var options = nomnom()
  .opts({
      config: {
      string: '-c PATH, --config=PATH',
      default: 'config.json',
      help: 'JSON file with tests to run'
    },
    debug: {
      string: '-d, --debug',
      help: 'Print debugging info'
    }
  })
  .parseArgs(["-d", "--config=test.json"]);
  
assert.ok(options.debug);
assert.equal(options.config, "test.json");

var options = nomnom.parseArgs(["-xvf", "--file=test.js"]);
assert.ok(options.x);
assert.equal(options.file, "test.js");

var parser = nomnom()
  .usage("test");
  
assert.equal(parser.getUsage(), "test");

var parser = nomnom()
  .scriptName("test")
  .help("help");
  
assert.equal(parser.getUsage(), "Usage: test\nhelp\n");


