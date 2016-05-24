const ed = require('ed25519-supercop');
/**
 * @param {Buffer} message
 * @param {Buffer} key - public key
 * @param {Buffer} pkey - private key
 * @return {Buffer} signature
 */
function sign(message, key, pkey) {
    return ed.sign(message, key, pkey);
}
/**
 * @param {Buffer} message
 * @param {Buffer} key - public key
 * @param {Buffer} signature
 * @return {boolean}
 */
function verify(message, key, signature) {
    return ed.verify(signature, message, key);
}
const keySize = 32;
const pkeySize = 32;
const signSize = 64;

module.exports = {
    sign,
    verify,
    keySize,
    pkeySize,
    signSize
};
