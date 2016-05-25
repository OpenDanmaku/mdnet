const internal = require('./connection/connection-internal.js');
const Connection = require('./connection/connection-class.js');
const co = require('co');
const EventEmitter = require('events');
const Message = require('./message.js');

/**
 * Send a message to a endpoint
 * @param {string} endpoint
 * @param {Message} message
 * @return {Promise}
 */
const send = co.wrap(function* (endpoint, message) {
    let conn = yield internal.connect(endpoint);
    conn.send(message.toBuffer());
    conn.close();
});

/**
 * Listen on endpoint
 * @param {string} endpoint
 */
const listen = internal.listen;

const messageEventCenter = new EventEmitter();
/**
 * Subscribe message
 * @param {string} type - Message type
 * @param {MessageCallback} callback
 */
function subscribe(type, callback) {
    messageEventCenter.on(type, callback);
}

/**
 * Message receive callback
 * @callback MessageCallback
 * @param {Message} message
 * @param {ID} nodeId
 */

internal.setDataListener(function (buf, conn) {
    let message = Message.fromBuffer(buf);
    messageEventCenter.emit("*", message, conn.remoteId);
    messageEventCenter.emit(message.type, message, conn.remoteId);
});

module.exports = {
    Connection,
    send,
    listen,
    subscribe
};
