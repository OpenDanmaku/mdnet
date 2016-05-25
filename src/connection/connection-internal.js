const PROTO_ID = require('./id.js');
/**
 * Split endpoint string
 * @param {string} endpoint string representation of endpoint
 * @return {array} splitted endpoint
 */
function splitEndpoint(endpoint) {
    let result = [];
    for (let i = 0; i < endpoint.length; i++) {
        if (endpoint[i] === '[') {
            let j = i + 1;
            while (j < endpoint.length && (endpoint[j] !== ':' || endpoint[j - 1] !== ']')) j++;
            if (endpoint[j - 1] !== ']') {
                throw new TypeError(`malformed endpoint '${endpoint}'`);
            }
            result.push(endpoint.slice(i + 1, j - 1));
            i = j;
        } else {
            let j = i;
            while (j < endpoint.length && endpoint[j] !== ':') j++;
            result.push(endpoint.slice(i, j));
            i = j;
        }
    }
    return result;
}

const protocols = {
    tcp: require('./tcp.js'),
    id: require('./id.js'),
}

/**
 * Create connection
 * @param {string} endpoint - endpoint descriptor
 * @return {Promise.<Connection>}
 */
function connect(endpoint) {
    let splittedEndpoint = splitEndpoint(endpoint);
    if (protocols[splittedEndpoint[0]] === undefined) {
        throw new Error(`unsupported protocol '${splittedEndpoint[0]}'`);
    }
    return protocols[splittedEndpoint[0]].connect(splittedEndpoint).then(onConnection);
}

/**
 * Listen on endpoint
 * @param {string} endpoint
 */
function listen(endpoint) {
    let splittedEndpoint = splitEndpoint(endpoint);
    if (protocols[splittedEndpoint[0]] === undefined) {
        throw new Error(`unsupported protocol '${splittedEndpoint[0]}'`);
    }
    return protocols[splittedEndpoint[0]].listen(splittedEndpoint, onConnection);
}

let dataListener = null;
function setDataListener(cb) {
    dataListener = cb;
}
/**
 * Connection callback
 * @type {ConnectionCallback}
 * @param {Connection} conn
 * @return {Connection}
 */
function onConnection(conn) {
    conn.on('data', buf => {
        dataListener(buf, conn);
    });
    conn.on('error', err => console.error(err.stack));
    // todo: add connection to storage
    PROTO_ID.onConnection(conn);
    return conn;
}

module.exports = { connect, splitEndpoint, setDataListener, listen };
