'use strict';

/**
 * Module dependencies.
 */

var util = require('./util');

/**
 * Expose methods.
 */

exports.getChange = getChange;

/**
 * Get change from history.
 *
 * @param {Array} history
 */

function getChange(history) {
  util.log('Starting check history.');

  var lastEntries = history.slice(0, 6);
  var sameEntries = lastEntries.slice(0, 5).every(function (value) {
    return value === history[0];
  });

  util.log('Getting last entries', lastEntries);

  // If there is 5 consecutive new status.
  if (lastEntries.length !== 6 || ! sameEntries || lastEntries[0] === lastEntries[5]) return false;

  // Get the last status.
  var lastStatus = history[0];

  // Run success or failure.
  return lastStatus;
}
