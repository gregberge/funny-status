'use strict';

/**
 * Module dependencies.
 */

var request = require('request');

/**
 * Expose module.
 */

var npm = module.exports = {};

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
    if (err) console.error(err);

    if (err) return cb(false);
    if (res.statusCode !== 200) return cb(false);

    // Parse body and test status.
    try { body = JSON.parse(body); } catch (err) { return cb(false); }
    if (! body.db_name) return cb(false);

    cb(true);
  });
};