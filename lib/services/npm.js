'use strict';

/**
 * Module dependencies.
 */

var request = require('request');

/**
 * Expose module.
 */

var npm = module.exports = {
  timeout: 3000
};

/**
 * Test if NPM is up.
 *
 * @param {Function} cb
 */

npm.up = function (cb) {
  request({
    url: 'http://registry.npmjs.org',
    timeout: 3000
  }, function (err, res, body) {
    if (err) return down(err);
    if (res.statusCode !== 200) return down();

    // Parse body and test status.
    try { body = JSON.parse(body); } catch (err) { return down(err); }
    if (! body.db_name) return down();

    up();
  });

  function down(err) {
    npm.status = 'down';
    cb(err);
  }

  function up() {
    npm.status = 'up';
    cb();
  }
};