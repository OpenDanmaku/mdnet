/**
 * Peer ID Protocol
 * @module connection/id
 */

const co = require('co');
const internal = require('./connection-internal.js');

let connectedIds = {};

/**
 * Connect to an ID
 * @param {Array} splittedEndpoint - the descriptor of the endpoint
 * @return {Promise.<Connection>}
 */
const connect = co.wrap(function* (splittedEndpoint) {
    let peerId;
    if (splittedEndpoint[1] === 'hex') {
        peerId = Buffer(splittedEndpoint[2], 'hex').toString('base64');
    } else {
        peerId = splittedEndpoint[1];
    }
    if (connectedIds[peerId] && connectedIds[peerId].length > 0) {
        return connectedIds[peerId][0];
    }
    throw new Error('unimplemented');
    /*
    let peerEndpoint = yield ID.lookup(peerId);
    let conn = yield internal.connect(peerEndpoint);
    if (conn.remoteId !== peerId.toString('base64')) {
        throw new Error('peer ID mismatch');
    }
    */
    return conn;
});

function onConnection(conn) {
    let id = conn.remoteId;
    if (!(id in connectedIds)) {
        connectedIds[id] = [];
    }
    connectedIds[id].push(conn);
    conn.on('close', function () {
        if (!connectedIds[id]) return;
        connectedIds[id] = connectedIds[id].filter(rconn => rconn !== conn);
        if (connectedIds[id].length === 0) delete connectedIds[id];
    });
}

module.exports = { connect, onConnection };
