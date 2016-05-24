const internal = require('./connection/connection-internal.js');
const Connection = require('./connection/connection-class.js');

/**
 * Send a message to a endpoint
 * @param {string} endpoint
 * @param {Message} message
 */
function send(endpoint, message) {}

module.exports = {
    Connection,
    send
};
