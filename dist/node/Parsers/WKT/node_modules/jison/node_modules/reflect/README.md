![Reflect.js](https://github.com/zaach/reflect.js/raw/master/reflectjs.png "Reflect.js")

Reflect.js is a JavaScript (ES3 compatible) implementation of [Mozilla's Parser API](https://developer.mozilla.org/en/SpiderMonkey/Parser_API). It does not currently support some of Mozilla's extensions, such as generators, list comprehensions, `for each`, E4X, etc. but may eventually support ones that are, or become Harmony proposals.
Builders are also supported.

Parsing really large files can be slow, for reasons [articulated](http://www.andychu.net/ecmascript/RegExp-Enhancements.html) by Andy Chu.


Download
========
You can download a minified-standalone version of reflect.js to embed in web pages [here](https://raw.github.com/zaach/reflect.js/master/standalone/reflect.js).

Install
=======
Reflect.js is available as a CommonJS module for Node.js. Simply install it with npm:

    npm install reflect

Use
=======

    var Reflect = require('reflect');

    var ast = Reflect.parse("var a = 4 + 7");

    console.log(Reflect.stringify(ast, "  "));

Refer to [Mozilla's docs](https://developer.mozilla.org/en/SpiderMonkey/Parser_API) for details on the AST interface.

Builders
=======
The optional [builder](https://developer.mozilla.org/en/SpiderMonkey/Parser_API#Builder_objects) parameter to Reflect.parse() makes it possible to construct user-specified data from the parser, rather than the default Node objects.

The reflect.js module exports the [default builder](https://raw.github.com/zaach/reflect.js/master/lib/nodes.js) so you can redefine only the node constructors you care about and leave the rest default.

    var Reflect = require('reflect');
    var builder = Reflect.builder;

    // redefine callback for variable declarations
    builder["variableDeclaration"] = function (kind, declarators, loc) { ... };

    var ast = Reflect.parse("var a = 4 + 7", {builder: builder});

License
=======
MIT X Licensed.
