
var Reflect = require('../dist/reflect').Reflect;

var print = console.log;

(function main(args, disscript) {
"use strict";
function runUnitTests() {
    // These programs avoid using constructs that trigger constant folding or
    // other optimizations in the JS engine. They are spaced and parenthesized
    // just so. Thus Reflect.stringify mirrors Reflect.parse for these strings.
    var tests = [
        // expressions
        "x;\n",
        "null;\n",
        "true;\n",
        "false;\n",
        "-0;\n",
        "x = y;\n",
        "void 0;\n",
        "void y;\n",
        "void f();\n",
        "[];\n",
        "({});\n",
        "({1e999: 0});\n",
        ('({get "a b"() {\n' +
         '    return this;\n' +
         '}});\n'),
        ("({get 1() {\n" +
         "    return this;\n" +
         "}});\n"),
        "[,, 2];\n",
        "[, 1,,];\n",
        "[1,,, 2,,,];\n",
        "[,,,];\n",
        '[0, 1, 2, "x"];\n',
        // no comprehension support
        //'[f(x) for (x in y)];\n',
        //'[f(x) for (x in y) for ([y, z] in w)];\n',
        //'[f(x) for (x in y) for ([y, z] in w) if (z.q())];\n',
        // no let expression support
        //"(let (x = 2) x + x);\n",
        //"z = let (x = 1) let (y = 2) x + y;\n",
        //"(let (c = new C) c.register(c)).build();\n",
        //"(let (t = x) (x = y, y = t));\n",
        "x.y.z;\n",
        "x[y[z]];\n",
        'x["y z"];\n',
        //'@["y z"];\n',
        "(0).toString();\n",
        "f()();\n",
        "f((x, y));\n",
        "f(x = 3);\n",
        "x.y();\n",
        "f(1, 2, 3, null, (g(), h));\n",
        "new (x.y);\n",
        "new (x());\n",
        "(new x).y;\n",
        "new (x().y);\n",
        "a * x + b * y;\n",
        "a * (x + b) * y;\n",
        "a + (b + c);\n",
        "a + b + c;\n",
        Array(1000).join("x + ") + "y;\n",
        Array(1000).join("x + y - ") + "z;\n",   //CRASH, stack overflow,  unfiled bug
        "x.y = z;\n",
        "get(id).text = f();\n",
        "[,] = x;\n",

        // YieldExpressions are only legal inside function bodies.
        //("function gen() {\n" +
         //"    yield 1;\n" +
         //"}\n"),
        //("function gen() {\n" +
         //"    yield (a, b);\n" +
         //"}\n"),
        //("function gen() {\n" +
         //"    (yield a), b;\n" +
         //"}\n"),

        // Reconstituting constant-folded NaNs and Infinities
        "x = 1e999 + y;\n",
        "x = y / -1e999;\n",
        "x = 0 / 0;\n",
        "x = (-1e999).toString();\n",

        // Statements
        //("let (x = 1) {\n" +
         //"    print(x * x);\n" +
         //"}\n"),
        ("if (a == b)\n" +
         "    x();\n" +
         "else\n" +
         "    y();\n"),
        ("if (a == b) {\n" +
         "    x();\n" +
         "} else {\n" +
         "    y();\n" +
         "}\n"),
        ("if (a == b)\n" +
         "    if (b == c)\n" +
         "        x();\n" +
         "    else\n" +
         "        y();\n"),
        ("while (a == b)\n" +
         "    c();\n"),
        ("if (a)\n" +
         "    while (b)\n" +
         "        ;\n" +
         "else\n" +
         "    c();\n"),
        ("if (a)\n" +
         "    while (b) {\n" +
         "        ;\n" +
         "    }\n" +
         "else\n" +
         "    c();\n"),
        ("for (;;)\n" +
         "    ;\n"),
        ("for (let i = 0; i < a.length; i++) {\n" +
         "    b[i] = a[i];\n" +
         "}\n"),
        ("for (t = (i in x); t; t = t[i])\n" +  // ExpressionNoIn syntax
         "    ;\n"),
        ("for (let t = (i in x); t; t = t[i])\n" +
         "    ;\n"),
        ("for (t = 1 << (i in x); t < 100; t++)\n" +
         "    ;\n"),
        ("for (var i in arr)\n" +
         "    dump(arr[i]);\n"),
        ('for ([k, v] in items(x))\n' +
         '    dump(k + ": " + v);\n'),
        ("if (x) {\n" +
         "    switch (f(a)) {\n" +
         "    case f(b):\n" +
         "    case \"12\":\n" +
         "        throw exc;\n" +
         "    default:\n" +
         "        fall_through();\n" +
         "    case 99:\n" +
         "        succeed();\n" +
         "    }\n" +
         "}\n"),
        "var x;\n",
        "var x, y;\n",
        "var x = 1, y = x;\n",
        "var x = y = 1;\n",
        "var x = f, g;\n",
        "var x = (f, g);\n",
        "var [x] = a;\n",
        "var [] = x;\n",
        "var [, x] = y;\n",
        "var [[a, b], [c, d]] = x;\n",
        "var {} = x;\n",
        "var {x: x} = x;\n",
        "var {x: a, y: b} = x;\n",
        "var {1: a, 2: b} = x;\n",
        "var {1: [], 2: b} = x;\n",
        'var {"a b": x} = y;\n',
        "const a = 3;\n",
        ('try {\n' +
         '    f();\n' +
         '} finally {\n' +
         '    cleanup();\n' +
         '}\n'),
        ('try {\n' +
         '    f();\n' +
         //'} catch (exc if (exc instanceof TypeError)) {\n' +
         //'    g();\n' +
         '} catch (x) {\n' +
         '    cope(x);\n' +
         '} finally {\n' +
         '    cleanup();\n' +
         '}\n'),

        // Functions
        ("function f() {\n" +
         "    g();\n" +
         "}\n"),
        //"function f(x) x * x;\n",
        //"function f(a) a = 1;\n",
        //"function f(x) function (y) x + y;\n",
        //"function f(x) ({name: x, value: 0});\n",

        // strict declarations
        ('"use strict";\n' +
         'x = 1;\n'),
        ('function f() {\n' +
         '    "use strict";\n' +
         '    x = 1;\n' +
         '}\n'),
        ('(function () {\n' +
         '    "use strict";\n' +
         '    x = 1;\n' +
         '});\n'),

        // Statement-vs-ExpressionStatement ambiguities
        ("(function () {\n" +
         "    go();\n" +
         "}());\n"),
        ("(function () {\n" +
         "}.x);\n"),
        ("(function name() {\n" +
         "}.x);\n"),
        ("(function () {\n" +
         "}.x = 1);\n"),
        ("(function name() {\n" +
         "}.x = 1);\n"),
        ("(function () {\n" +
         "}.x, function () {\n" +
         "}.y);\n"),
        ("(function () {\n" +
         "} + x) * y;\n"),
        ("(function () {\n" +
         "} * x + y);\n"),
        //"(let (t = x) (x = y, y = t));\n",
        //"(let (y = f()) x = y, x += t);\n",
        "({a: f()});\n",
        "({a: my_a} = f());\n",

        // e4x
        //'default xml namespace = "http://w3.org/";\n',
        //"y.*;\n",
        //"y.ns::e;\n",
        //"y.ns::*;\n",
        //"y.(*);\n",
        //"y.function::length;\n",
        //"y.function::[z + n];\n",
        //"y.(*.length() === 0);\n",
        //"y.(f(ns::*));\n",
        //("with (x)\n" +
         //"    f(* == *);\n"),
        //"<{tag}></{tag}>;\n",
        //"<><{tag}></{tag}></>;\n",
        //'<tag attr="value"/>;\n',
        //'<{tag} attr="value"/>;\n',
        //"<tag {attr}={value}/>;\n",
        //'<{tag} attr={0}/>;\n',
        //"x.y.@z;\n",
        ////"x..y..z;\n",  // Reflect.parse doesn't properly support ..
        ////"x.y..z.w;\n",
        //"x..@y;\n",
        //"x.y.@n::z;\n",
        //"x..@n::y;\n",
        //"x..@[q];\n",
        ////"x..@*::y;\n",
        //"x.y.@[z];\n",

        // misc
        ('options("tracejit");\n' +
         "try {\n" +
         "} catch (e) {\n" +
         "}\n"),
        ("function test() {\n" +
         "    var s1 = evalcx(\"lazy\");\n" +
         "    expect = function () {\n" +
         "        test();\n" +
         "    }(s1);\n" +
         "}\n"),
        ("try {\n" +
         "    var a = new Array(100000);\n" +
         "    var i = a.length;\n" +
         "    new i(eval(\"var obj = new Object(); obj.split = String.prototype.split;\"));\n" +
         "} catch (e) {\n" +
         "}\n"),
        ("test3();\n" +
         "function test3() {\n" +
         "    try {\n" +
         "        eval(\"for(let y in [\\\"\\\", ''])\");\n" +
         "    } catch (ex) {\n" +
         "    }\n" +
         "    new test3;\n" + 
         "}\n"),
    ];

    for (var i = 0; i < tests.length; i++) {
        var b = tests[i], a;
        try {
            a = Reflect.stringify(Reflect.parse(b, {loc: false}));
            if (typeof a !== "string") {
                throw new TypeError("Reflect.stringify returned " +
                                    (a !== null && typeof a === "object"
                                     ? Object.prototype.toString.call(a)
                                     : String(a)) +
                                    "; expected string");
            }
        } catch (exc) {
            print("FAIL - Exception thrown.");
            print(exc.name + ": " + exc.message);
            print(exc.stack);
            print("Test was: " + b);
            print();
            continue;
        }
        if (a !== b) {
            print("FAIL - Mismatch.");
            print("got:      " + String(a));
            print("expected: " + String(b));
            print();
        }
    }
}

return runUnitTests();
})(process.args,
function /*disscript*/() {
   // Note: Some tests fail if you use dis(Function(s)) instead.
   try {
       eval("throw dis('-r', '-S');\n" + arguments[0]);
       throw "FAIL";
   } catch (exc) {
       if (exc !== void 0)
           throw exc;
   }
});


