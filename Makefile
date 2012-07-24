TESTS = test/*.js
TIMEOUT = 5000
REPORTER = spec
MOCHAOPTS=

build:
	@node-gyp clean && node-gyp configure && node-gyp build

test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) --timeout $(TIMEOUT) $(MOCHAOPTS) $(TESTS)

test-cov: lib-cov
	@HTTPSYNC_COV=1 $(MAKE) test
	@HTTPSYNC_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@rm -rf lib-cov
	@jscoverage lib lib-cov

clean:
	@rm -rf lib-cov
	@rm -f coverage.html

.PHONY: build test test-cov lib-cov clean
