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
        before(function () {
            RPC.ping = () => 'ping';
            RPC.add = (a, b) => a + b;
            RPC.wait = time => new Promise(resolve => setTimeout(resolve, time));
        })
        it('call', function () {
            return RPC('tcp:127.0.0.1:2333').ping().should.eventually.equal('ping');
        })
        it('call2', function () {
            return RPC('tcp:127.0.0.1:2333').add(1, 2).should.eventually.equal(3);
        })
        it('call3', function () {
            return RPC('tcp:127.0.0.1:2333').add('a', 'b').should.eventually.equal('ab');
        })
        it('call4', function () {
            return RPC('tcp:127.0.0.1:2333').wait(500).should.eventually.equal(undefined);
        })
    })
})
