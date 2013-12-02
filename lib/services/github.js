'use strict';

/**
 * Module dependencies.
 */

var request = require('request');

/**
 * Expose module.
 */

var github = module.exports = {
  timeout: 3000
};

/**
 * Test if GitHub is up.
 *
 * @param {Function} cb
 */

github.up = function (cb) {
  request({
    url: 'https://status.github.com/api/status.json',
    timeout: github.timeout
  }, function (err, res, body) {
    if (err) return down(err);
    if (res.statusCode !== 200) return down();

    // Parse body and test status.
    try { body = JSON.parse(body); } catch (err) { return down(err); }
    if (body.status !== 'good') return down();

    up();
  });

  function down(err) {
    github.status = 'down';
    cb(err);
  }

  function up() {
    github.status = 'up';
    cb();
  }
};