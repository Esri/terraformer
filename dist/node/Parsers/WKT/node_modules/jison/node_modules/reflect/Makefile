all: build test

build: move
	jison lib/grammar.y lib/lexer.l
	mv grammar.js dist/parser.js

move: lib
	cp lib/*.js dist/

test: move dist
	node test/all-tests.js

standalone: move dist
	node scripts/standalone.js | uglifyjs > standalone/reflect.js

