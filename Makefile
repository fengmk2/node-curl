TESTS = test/*.js
TIMEOUT = 5000
REPORTER = spec
MOCHAOPTS=

build:
	@node-gyp clean configure build

test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) --timeout $(TIMEOUT) $(MOCHAOPTS) $(TESTS)

.PHONY: build test
