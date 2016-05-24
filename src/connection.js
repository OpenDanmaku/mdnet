const internal = require('./connection/connection-internal.js');
const Connection = require('./connection/connection-class.js');
const co = require('co');

/**
 * Send a message to a endpoint
 * @param {string} endpoint
 * @param {Message} message
 * @return {Promise}
 */
const send = co.wrap(function* (endpoint, message) {
    let conn = yield internal.connect(endpoint);
    yield conn.send(message.toBuffer());
});

const listen = internal.listen;

module.exports = {
    Connection,
    send,
    listen
};
