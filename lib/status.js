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
  return require('./services/' + name);
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
  service.up(function (up) {
    // Initialize lastUp.
    if (service.lastUp === undefined) service.lastUp = up;

    // Prevent sounds to be played each times.
    if (service.lastUp === up) return ;

    // Play up sound and down sound.
    if (up) play(path.resolve('./sounds/mario-stage-cleared.mp3'));
    if (! up) play(path.resolve('./sounds/mario-die.mp3'));

    // Update lastUp.
    service.lastUp = up;
  });
}