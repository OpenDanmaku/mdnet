const EventEmitter = require('events');
let connection = {};
let protocols = {};

/*
class Connection extends EventEmitter {
    constructor(endpoint) {
        super();
    }
}
*/

/**
 * Connect to the endpoint
 * @param {string|array} endpoint - the descriptor of the endpoint
 * @return {Promise.<Stream>}
 */
function connect(endpoint) {
    if (typeof endpoint === 'string') {
        endpoint = endpoint.split(':');
    }
    if (typeof protocols[endpoint[0]] === 'undefined') {
        throw new Error('unsupported protocol');
    }
    return protocols[endpoint[0]].connect(endpoint);
};

protocols.tcp = require('./tcp.js');

module.exports = { /*Connection,*/ connect };
