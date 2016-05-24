/**
 * Peer ID Protocol
 * @module connection/id
 */

const co = require('co');
const internal = require('./connection-internal.js');

/**
 * Connect to an ID
 * @param {Array} splittedEndpoint - the descriptor of the endpoint
 * @return {Promise.<Connection>}
 */
const connect = co.wrap(function* (splittedEndpoint) {
    let peerId;
    if (splittedEndpoint[1] === 'hex') {
        peerId = new Buffer(splittedEndpoint[2], 'hex');
    } else {
        peerId = new Buffer(splittedEndpoint[1], 'base64');
    }
    let peerEndpoint = yield ID.lookup(peerId);
    let conn = yield internal.connect(peerEndpoint);
    if (conn.remoteId !== peerId.toString('base64')) {
        throw new Error('peer ID mismatch');
    }
    return conn;
});

module.exports = { connect };
