const EventEmitter = require('events');
const env = require('../environment.js');
/**
 * Connection wrapper class
 * @class
 */
class Connection extends EventEmitter {
    /**
     * @constructor
     * @param {string} endpoint - the descriptor of the endpoint
     * @param {stream.Duplex} stream - the internal stream object
     */
    constructor(stream) {
        super();
        this._private = {};
        //this._private.endpoint = endpoint;
        this._private.stream = stream;
        this._private.recvBuf = new Buffer(0);
        this._private.handshaked = false;
        stream.on('error', (err) => this.emit('error', err));
        stream.on('close', () => this.emit('close'));
        stream.on('data', (buf) => {
            buf = Buffer.concat([this._private.recvBuf, buf]);
            if (!this._private.handshaked) {
                if (buf.length < 3 + 32) {
                    this._private._recvBuf = buf;
                    return;
                }
                // todo: check handshake
                let remoteId = buf.slice(3, 3 + 32).toString('base64');
                this._private.remoteId = remoteId;
                buf = buf.slice(3 + 32);
                this._private.handshaked = true;
                this.emit('handshake');
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
        // todo: handshake
        let handshakeBuf = Buffer.concat([new Buffer('MD\x01'), env.key.public]);
        this._private.stream.write(handshakeBuf);
    }
    /**
     * Send message to the peer
     * @param {Buffer} message - message to send
     * @return {Promise}
     */
    send(message) {
        // todo: send (packed & signed) data
    }
    /**
     * Peer ID
     * @type {string}
     */
    get remoteId() {
        return this._private.remoteId;
    }
    /**
     * handshake completes and ready to send/recv data
     * @event module:ConnectionInternal~Connection#handshake
     */
    /**
    * data comes
    * @event  module:ConnectionInternal~Connection#data
    * @param {Buffer} data - received data packet
    * @param {Buffer} signature - data signature
    */
    /**
     * connection closes
     * @event module:ConnectionInternal~Connection#close
     */
}
module.exports = Connection;
