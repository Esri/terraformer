var nomnom = require("../nomnom"),
    assert = require("assert");

var opts = [
  { name: 'logfile',
    string: '-l',
    default: 'log.txt'
  }
];

var args = ["--test=test.js", "-l", "test.log"];

var options = nomnom().parseArgs(opts, { argv: args });
var shortcutOpts = nomnom().parseArgs(opts, { argv: args });

assert.equal(JSON.stringify(options), JSON.stringify(shortcutOpts));