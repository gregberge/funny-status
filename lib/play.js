'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker');

/**
 * Expose module.
 */

module.exports = play;

/**
 * Play an mp3 sound file.
 *
 * @param {String} filePath
 */

function play(filePath) {
  fs.createReadStream(filePath)
    .pipe(new lame.Decoder())
    .on('format', function (format) {
      this.pipe(new Speaker(format));
    });
}