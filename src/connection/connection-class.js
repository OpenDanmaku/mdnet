const EventEmitter = require('events');
const env = require('../environment.js');
const ed25519 = require('../ed25519.js');
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
                if (buf.length < 3 + ed25519.keySize) {
                    this._private.recvBuf = buf;
                    return;
                }
                let magic = buf.slice(0, 3);
                if (magic.toString('utf8') !== 'MD\x01') {
                    this.emit('error', new Error('handshake failed'));
                    this._private.stream.end();
                    return;
                }
                let remoteId = buf.slice(3, 3 + ed25519.keySize);
                this._private.remoteId = remoteId;
                buf = buf.slice(3 + ed25519.keySize);
                this._private.handshaked = true;
                this.emit('handshake');
            }
            while (buf.length >= 2 + ed25519.signSize) {
                let dataLen = buf.readUInt16BE(0);
                if (buf.length < 2 + ed25519.signSize + dataLen) {
                    break;
                }
                let signature = buf.slice(2, 2 + ed25519.signSize);
                let data = buf.slice(2 + ed25519.signSize, 2 + ed25519.signSize + dataLen);
                if (!ed25519.verify(data, this._private.remoteId, signature)) {
                    this.emit('error', new Error('signature check failed'));
                    this._private.stream.end();
                    return;
                }
                this.emit('data', data, signature);
                buf = buf.slice(2 + ed25519.signSize + dataLen);
            }
            this._private.recvBuf = buf;
        });
        let handshakeBuf = Buffer.concat([new Buffer('MD\x01'), env.key.public]);
        this._private.stream.write(handshakeBuf);
    }
    /**
     * Send message to the peer
     * @param {Buffer} message - message to send
     * @return
     */
    send(message) {
        let signature = ed25519.sign(message, env.key.public, env.key.private);
        let buf = new Buffer(2 + ed25519.signSize + message.length);
        buf.writeUInt16BE(message.length, 0);
        signature.copy(buf, 2);
        message.copy(buf, 2 + ed25519.signSize);
        this._private.stream.write(buf);
    }
    /**
     * Close connection
     */
    close() {
        this._private.stream.end();
    }
    /**
     * Peer ID
     * @type {string}
     */
    get remoteId() {
        return this._private.remoteId.toString('base64');
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
