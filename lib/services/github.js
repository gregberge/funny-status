'use strict';

/**
 * Module dependencies.
 */

var request = require('request');

/**
 * Expose module.
 */

var github = module.exports = {};

/**
 * Test if GitHub is up.
 *
 * @param {Function} cb
 */

github.up = function (cb) {
  request({
    url: 'https://status.github.com/api/status.json',
    timeout: 3000
  }, function (err, res, body) {
    if (err) console.error(err);

    if (err) return cb(false);
    if (res.statusCode !== 200) return cb(false);

    // Parse body and test status.
    try { body = JSON.parse(body); } catch (err) { return cb(false); }
    if (body.status !== 'good') return cb(false);

    cb(true);
  });
};