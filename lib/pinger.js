'use strict';

/**
 * Module dependencies.
 */

var async = require('async');
var forEach = require('lodash').forEach;
var map = require('lodash').map;
var util = require('./util');

/**
 * Expose module.
 */

module.exports = Pinger;

/**
 * Create a Pinger instance.
 */

function Pinger() {
  this.services = {};
  this.history = {};
}

/**
 * Add a service.
 *
 * @param {String} name
 * @param {Function} service
 */

Pinger.prototype.add = function (name, service) {
  this.services[name] = service;
  this.history[name] = [];
};

/**
 * Ping all services.
 *
 * @param {Function} cb
 */

Pinger.prototype.ping = function (cb) {
  util.log('Starting ping services.');

  var history = this.history;
  var statusChecks = map(this.services, function (service, name) {
    return function (cb) {
      util.log('Ping %s service', name);
      service(function (err) {
        if (err) util.log('Service %s, error', name, err);

        // Status.
        var status = err ? 'down' : 'up';
        util.log('Service %s, %s', name, status);

        // History.
        history[name].unshift(status);

        cb();
      });
    };
  });

  async.parallel(statusChecks, function () {
    this.purge();
    cb();
  }.bind(this));
};

/**
 * Purge history.
 */

Pinger.prototype.purge = function () {
  forEach(this.history, function (entry, name) {
    this.history[name] = entry.slice(0, 10);
  }.bind(this));
};