var nomnom = require("../nomnom"),
    assert = require("assert");

var options = nomnom().parseArgs(["-d", "file.js", "--atomic=true", "addon.xpi"]);

var url = options[0]; // get the first positional arg
var debug = options.debug; // see if --debug was specified

assert.ok(options.d);
assert.equal(options[0], "file.js");
assert.ok(options.atomic);
assert.equal(options[1], "addon.xpi");