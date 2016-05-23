const net = require('net');

function connect(endpoint) {
    let host = parseInt(endpoint[1]);
    let port = parseInt(endpoint[2]);
    return connectAsync(port, host);
};

function connectAsync(port, host) {
    return new Promise((resolve, reject) => {
        let c = net.connect(port, host);
        function onError(err) {
            reject(err);
        }
        function onConnect() {
            c.removeListener('error', onError);
            resolve(c);
        }
        c.on('error', onError);
        c.on('connect', onConnect);
    });
}

module.exports = { connect };
