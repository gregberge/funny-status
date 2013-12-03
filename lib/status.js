'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var play = require('./play');

/**
 * Expose methods.
 */

exports.ping = pingServices;
exports.stop = stop;

/**
 * Services and statuses.
 */

var services = ['github', 'npm'].map(function (name) {
  var service = require('./services/' + name);
  service.name = name;
  return service;
});

/**
 * Ping interval.
 */

var pingInterval;

/**
 * Ping each services.
 */

function pingServices() {
  stop();
  services.forEach(pingService);
  pingInterval = setTimeout(pingServices, 30000);
}

/**
 * Stop ping.
 */

function stop() {
  clearInterval(pingInterval);
  pingInterval = null;
}

/**
 * Check service.
 *
 * @param {Service} service
 */

function pingService(service) {
  service.up(function (service, up) {
    // Initialize lastUp.
    if (service.lastUp === undefined) {
      service.lastUp = up;
      service.count = 5;
    }

    // Increment count.
    if (service.lastUp === up) service.count++;
    else service.count = 1;

    // Set lastUp.
    service.lastUp = up;

    // Play up sound and down sound.
    if (service.count === 5) {
      if (up) play(path.resolve(__dirname, '../sounds/mario-stage-cleared.mp3'));
      if (! up) play(path.resolve(__dirname, '../sounds/mario-die.mp3'));
    }

    console.log('%s is %s', service.name, up ? 'up' : 'down');
  }.bind(null, service));
}