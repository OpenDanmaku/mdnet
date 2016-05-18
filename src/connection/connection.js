const util = require('util');
const EventEmitter = require('events');
let connection = {};
let protocols = {};

function Connection(stream) {
    if (!(this instanceof Connection)) return CConnection.apply({
        __proto__: Connection.prototype
    }, arguments);
    EventEmitter.apply(this);
}
util.inherits(Connection, EventEmitter);

/**
 * Connect to the endpoint
 * @param {string|array} endpoint - the descriptor of the endpoint
 * @return {Promise.<Connection>}
 */
connection.connect = function (endpoint) {
    if (typeof endpoint === 'string') {
        endpoint = endpoint.split(':');
    }
    if (typeof protocols[endpoint[0]] === 'undefined') {
        throw new Error('unsupported protocol');
    }
    return protocols[endpoint[0]].connect(endpoint).then(Connection);
};

protocols.tcp = require('./tcp.js');
