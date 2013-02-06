var nomnom = require("../nomnom"),
    assert = require("assert");


var opts = [
  { name: 'test0',
    position: 0
  },
  { name: 'file',
    string: '-f FILE',
  },
  { name: 'logfile',
    string: '-l',
    default: 'log.txt'
  },
  { name: 'atomic',
    string: '-a'
  },
  { name: 'count',
    string: '-c, --count=3'
  },
  { name: 'test2',
    position: 2
  },
  { name: 'test1',
    position: 1,
    default: 'def1'
  }
];

parser = nomnom();

// mix args w/ values with positional args
var options = parser.parseArgs(opts, {argv: ["-l", "temp.log", "-c", "12", "-a", "test0.js",
  "test1.js", "-f", "file.js", "test2.js"]});

assert.equal(options.test0, "test0.js");
assert.equal(options.test1, "test1.js");
assert.equal(options.test2, "test2.js");
assert.equal(options.logfile, "temp.log");
assert.equal(options.count, 12);
assert.equal(options.file, "file.js");
assert.ok(options.atomic);

// defaults
var options = parser.parseArgs(opts, { argv: []});
assert.ok(!options.test0);
assert.equal(options.test1, "def1");
assert.ok(!options.test2);
assert.equal(options.logfile, "log.txt")

// make sure we don't parse 'node test/runtests.js'
options = parser.parseArgs(opts, {argv: []});
assert.ok(!options.test0);
assert.equal(options.test1, "def1");
assert.ok(!options.test2);

// positionals that weren't specified in opts
options = nomnom.parseArgs({}, { argv: ["pos1", "pos2", "pos3"] });
assert.equal(options[0], "pos1");
assert.equal(options[1], "pos2");
assert.equal(options[2], "pos3");