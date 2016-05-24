/**
 * Message module
 * @module message
 */

const _private = Symbol();

/**
 * Message class
 * @class
 */
module.exports = class Message {
    /**
     * @constructor
     * @param {string} type
     */
    constructor(type) {
        this[_private] = {};
        this[_private].type = type;
    }
    /**
     * Output message in buffer
     * @return {Buffer}
     */
    toBuffer() {
        let messageObject = {
            type: this[_private].type,
            message: this
        };
        return new Buffer(JSON.stringify(messageObject), 'utf8');
    }
    /**
     * Convert buffer to message
     * @param {Buffer} buffer
     * @return {Message}
     */
    static fromBuffer(buf) {
        let messageObject = JSON.parse(buf);
        let message = messageObject.message;
        message.__proto__ = Message.prototype;
        message[_private] = { type: messageObject.type };
        return message;
    }
    get type() {
        return this[_private].type;
    }
}
