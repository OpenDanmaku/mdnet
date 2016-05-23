/**
 * Module that handles connections
 * @module connection
 */
const EventEmitter = require('events');
let connection = {};
let protocols = {};

/**
 * Connection class
 * @class
 */
class Connection extends EventEmitter {
    /**
     * @constructor
     * @param {string|array} endpoint - the descriptor of the endpoint
     */
    constructor(endpoint) {
        super();
        if (typeof endpoint === 'string') {
            endpoint = endpoint.split(':');
        }
        if (typeof protocols[endpoint[0]] === 'undefined') {
            throw new Error('unsupported protocol');
        }
        this._endpoint = endpoint.join(':');
        let stream = protocols[endpoint[0]].connect(endpoint);
        this._stream = stream;
        stream.on('connect', () => this.emit('connect'));
        stream.on('error', (err) => this.emit('error', err));
        stream.on('close', () => this.emit('close'));
        stream.on('data', (buf) => {
            // todo: proceed data
        });
    }
    /**
     * Send message to the peer
     * @param {Buffer} message - message to send
     * @return {Promise}
     */
    send(message) {
        // todo: send (packed & signed) data
    }
}

protocols.tcp = require('./tcp.js');

module.exports = { Connection };
