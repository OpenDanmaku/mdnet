const should = require('chai').should();
require('chai').use(require('chai-as-promised'));
const internal = require('../src/connection/connection-internal.js');
const connection = require('../src/connection.js');
const Message = require('../src/message.js');
const RPC = require('../src/rpc.js');

process.on('uncaughtException', e => console.error(e.stack));
process.on('unhandledRejection', e => console.error(e.stack));
let listening = false;
if (!listening) {
    connection.listen('tcp:[::]:2333');
    listening = true;
}

describe('mdnet', function () {
    describe('connection', function () {
        it('.send', function (done) {
            connection.subscribe('test', (message) => {done();});
            connection.send('tcp:[::1]:2333', new Message('test'));
        })
        describe('internal', function () {
            it('.connect', function () {
                let conn = internal.connect('tcp:127.0.0.1:2333');
            })
        })
    })

    describe('RPC', function () {
        describe('register', function () {
            RPC.ping = () => 'ping';
        })
        describe('call', function () {
            return RPC('tcp:127.0.0.1:2333').ping().should.eventually.equal('ping');
        })
    })
})
