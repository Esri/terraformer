var nomnom = require("../nomnom"),
    assert = require("assert");

var options = nomnom().parseArgs(["--no-debug", "--atomic", "-g"]);

assert.equal(options.debug, false, "--no should negate flag");
assert.equal(options.atomic, true, "regular flag should work");
assert.equal(options.g, true);