'use strict';

require('colors');
const logger = require('linglog')('publishy');
const emoji = require('node-emoji').emoji;

module.exports = {
  success: logger.tplOut(`[<%= name %>]: ${emoji.o}  <%= output %>`.green),
  info: logger.tplOut(`[<%= name %>]: <%= output %>`.blue),
  warn: logger.tplOut(`[<%= name %>]: ${emoji.speech_balloon}  <%= output %>`.yellow),
  line: logger.tplOut(`[<%= name %>]: -----------------------------`.yellow),
  error: logger.tplErr(`[<%= name %>]: ${emoji.x}  <%= output %>`.red)
};
