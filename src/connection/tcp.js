const net = require('net');

let tcp = {};

tcp.connect = function (endpoint) {
    let host = parseInt(endpoint[1]);
    let port = parseInt(endpoint[2]);
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
};
