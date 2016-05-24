/**
 * TCP Protocol
 * @module connection/tcp
 */

const net = require('net');

/**
 * Connect to TCP endpoint
 * @param {array} endpoint - the descriptor of the endpoint
 * @return {Stream}
 */
function connect(endpoint) {
    let host = parseInt(endpoint[1]);
    let port = parseInt(endpoint[2]);
    return net.connect(port, host);

};

module.exports = { connect };
