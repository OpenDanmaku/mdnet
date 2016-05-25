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
    let host = splittedEndpoint[1];
    let port = parseInt(splittedEndpoint[2]);
    let stream = net.connect(port, host);
    return new Promise((resolve, reject) => {
        stream.once('error', reject);
        stream.once('connect', () => {
            stream.removeListener('error', reject);
            let host = stream.remoteHost;
            let port = stream.remotePort;
            let endpoint = net.isIPv6(host) ? `tcp:[${host}]:${port}` : `tcp:${host}:${port}`;
            let conn = new Connection(stream, endpoint);
            conn.once('error', reject);
            conn.once('handshake', () => {
                conn.removeListener('error', reject);
                resolve(conn);
            });
        });
    });
}

/**
 * Listen on TCP endpoint
 * @param {Array} splittedEndpoint - the descriptor of the endpoint
 * @param {ConnectionCallback} callback
 * @return {Promise}
 */
function listen(splittedEndpoint, callback) {
    let server = net.createServer((c) => {
        let host = c.remoteHost;
        let port = c.remotePort;
        let endpoint = net.isIPv6(host) ? `tcp:[${host}]:${port}` : `tcp:${host}:${port}`;
        let conn = new Connection(c, endpoint);
        function handleError() {
            conn.close();
        }
        conn.once('error', handleError);
        conn.once('handshake', () => {
            conn.removeListener('error', handleError);
            callback(conn);
        });
    });
    let host = splittedEndpoint[1];
    let port = parseInt(splittedEndpoint[2]);
    server.listen(port, host);
}

module.exports = { connect, listen };
