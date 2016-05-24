/**
 * TCP Protocol
 * @module connection/tcp
 */

const net = require('net');
const Connection = require('./connection-class.js');

/**
 * Connect to TCP endpoint
 * @param {Array} splittedEndpoint - the descriptor of the endpoint
 * @return {Promise.<Connection>}
 */
function connect(splittedEndpoint) {
    let host = parseInt(splittedEndpoint[1]);
    let port = parseInt(splittedEndpoint[2]);
    let stream = net.connect(port, host);
    return new Promise((resolve, reject) => {
        stream.once('error', reject);
        stream.once('connect', () => {
            stream.removeListener('error', reject);
            let conn = new Connection(stream);
            conn.once('error', reject);
            conn.once('handshake', () => {
                conn.removeListener('error', reject);
                resolve(conn);
            });
        });
    });
};

module.exports = { connect };
