var nomnom = require("../nomnom"),
    assert = require('assert'),
    sys = require('sys');

var called;

var parser = nomnom()
  .globalOpts({
    debug : {
      string: '-d, --debug'
    }
  });

parser.command('browser')
  .opts({
    port: {
      string: "-p PORT, --port=PORT",
      default: 3000,
      help: "port to run test server on"
    }
  })
  .callback(function(options) {
    assert.ok(false, "shouldn't call callback for 'browser' command");
  });

parser.command('node')
  .opts({
    filename: {
      position: 1,
      help: "test file to run in node"
    },
    config: {
      string: "-c FILE, --config=FILE",
      default: 'config.json',
      help: "json file with tests to run"
    }
  })
  .callback(function(options) {
    called = true;
    assert.equal(options.filename, "test.js");
    assert.equal(options.config, "test.json");
    assert.ok(options.debug, "should pick up global arg");
  })
  .help("** Run all the node tests **");

parser.parseArgs(["node", "test.js", "-c", "test.json", "-d"]);

assert.ok(called, "node command callback should be called");


/* no command specified */
called = false;
parser = nomnom()
  .opts({
    version : {
      string: '-v, --version'
    }
  })
  .callback(function(options) {
    called = true;
    assert.ok(options.test);
    assert.ok(options.version);
  })
  .parseArgs(["test.js", "--test", "-v"]);

assert.ok(called, "no-command callback should be called");

/* 
parser.parseArgs(globalOpts, {
  argv: ["notarealcommand", "test.js", "-c", "test.json"],
  printFunc: function(str) {
    assert.ok(/no such command/.test(str), "should notify if unknown command");
  }
});
*/
