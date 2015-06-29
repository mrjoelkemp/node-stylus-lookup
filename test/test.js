var assert = require('assert');
var mock = require('mock-fs');
var lookup = require('../');

describe('stylus-lookup', function() {
  beforeEach(function() {
    mock({
      example: {
        // jscs: disable maximumLineLength
        'main.styl': '@import "blueprint"; @require "another"; @require "styles.styl"',
        // jscs: enable maximumLineLength
        'another.styl': '@import "nested/foo"',
        'styles.styl': '@import "styles2.css"',
        'styles2.css': '',
        blueprint: {
          'index.styl': ''
        },
        nested: {
          'foo.styl': ''
        }
      }
    });
  });

  afterEach(mock.restore);

  it('handles index.styl lookup', function() {
    assert.equal(lookup('blueprint', 'example/main.styl', 'example'),
      process.cwd() + '/example/blueprint/index.styl');
  });

  it('handles .css lookups', function() {
    assert.equal(lookup('styles2.css', 'example/styles.styl', 'example'),
      process.cwd() + '/example/styles2.css');
  });

  it('handles same directory lookup', function() {
    assert.equal(lookup('another', 'example/main.styl', 'example'),
      process.cwd() + '/example/another.styl');
  });

  it('handles subdirectory lookup', function() {
    assert.equal(lookup('nested/foo', 'example/another.styl', 'example'),
      process.cwd() + '/example/nested/foo.styl');
  });

  it('handles extensionless lookup', function() {
    assert.equal(lookup('another', 'example/main.styl', 'example'),
      process.cwd() + '/example/another.styl');
  });

  it('handles extensioned lookup', function() {
    assert.equal(lookup('styles.styl', 'example/main.styl', 'example'),
      process.cwd() + '/example/styles.styl');
  });

  it.skip('supports globbing imports');
  it.skip('supports additional path lookups');
});
