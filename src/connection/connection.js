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
     * @param {string} endpoint the descriptor of the endpoint
     */
    constructor(endpoint) {
        super();
        this._private = {};
        this._private.endpoint = endpoint;
        endpoint = splitEndpoint(endpoint);
        if (typeof protocols[endpoint[0]] === 'undefined') {
            throw new Error('unsupported protocol');
        }
        let stream = protocols[endpoint[0]].connect(endpoint);
        this._private.stream = stream;
        this._private.recvBuf = new Buffer(0);
        this._private.handshaked = false;
        stream.on('connect', () => {
            // todo: handshake
            var handshakeBuf = Buffer.concat([new Buffer('MD\x01')/*, pubkey*/]);
            this._private.stream.write(handshakeBuf);
        });
        stream.on('error', (err) => this.emit('error', err));
        stream.on('close', () => this.emit('close'));
        stream.on('data', (buf) => {
            // todo: proceed data
            buf = Buffer.concat([this._private.recvBuf, buf]);
            if (!this._private.handshaked) {
                if (buf.length < 3 + 32) {
                    this._private._recvBuf = buf;
                    return;
                }
                // todo: check handshake
                buf = buf.slice(3 + 32);
                this._private.handshake = true;
                this.emit('connect');
            }
            while (buf.length > 0) {
                let dataLen = buf.readUInt16BE(0);
                if (buf.length < 2 + 32 + dataLen) {
                    this._private._recvBuf = buf;
                    return;
                }
                let signature = buf.slice(2, 2 + 32);
                let data = buf.slice(2 + 32, 2 + 32 + dataLen);
                buf = buf.slice(2 + 32 + dataLen);
                // todo: check signature
                this.emit('data', data, signature);
            }
        });
    }
    /**
     * Send message to the peer
     * @param {Buffer} message message to send
     * @return {Promise}
     */
    send(message) {
        // todo: send (packed & signed) data
    }
    get endpoint() {
        return this._private.endpoint;
    }
    get remoteId() {
        return this._private.remoteId;
    }
    /**
     * emit when handshake completes and is ready to send/recv data
     * @event module:connection~Connection#connect
     */
    /**
    * emit when data comes
    * @event  module:connection~Connection#data
    * @param {Buffer} data received data packet
    * @param {Buffer} signature data signature
    */
}

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
                throw new TypeError('malformed endpoint');
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

protocols.tcp = require('./tcp.js');

module.exports = { Connection };
