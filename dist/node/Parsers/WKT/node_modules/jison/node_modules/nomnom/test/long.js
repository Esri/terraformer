var nomnom = require("../nomnom"),
    assert = require("assert");


var options = nomnom.parseArgs({}, {argv: ["--atomic"]});

assert.ok(options.atomic);


opts = [
  { name: 'atomic',
    string: '--atomic'
  },
  { name: 'config',
    string: '--config=PATH'
  },
];

var parser = nomnom();
var options = parser.parseArgs(opts, {argv: ["--atomic","--config"]});

assert.ok(options.atomic);
assert.ok(options.config);

options = parser.parseArgs(opts, {argv: ["--atomic=3", "--config=tests.json"]});
assert.equal(options.atomic, 3);
assert.equal(options.config, "tests.json");

