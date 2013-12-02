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
  service.up(function (err) {
    if (err) console.error(err);

    // Initialize prevStatus.
    if (! service.prevStatus) service.prevStatus = service.status;

    // Prevent sounds to be played each times.
    if (service.prevStatus === service.status) return ;

    // Play up sound and down sound.
    if (service.status === 'down') play(path.resolve('./sounds/mario-die.mp3'));
    if (service.status === 'up') play(path.resolve('./sounds/mario-stage-cleared.mp3'));

    // Update previous status.
    service.prevStatus = service.status;
  });
}