const should = require('chai').should();
const internal = require('../src/connection/connection-internal.js');
const connection = require('../src/connection.js');

before(function () {
    connection.listen('tcp:[::1]:2333');
})

describe('connection', function () {
    describe('internal', function () {
        describe('.connect', function () {
            let conn = internal.connect('tcp:127.0.0.1:1234');
        })
    })
    describe('listen and send', function (done) {
        connection.send('tcp:[::1]:2333', new Message());
        connection.on('message', (message) => {done();});
    })
})

describe('RPC', function () {
    describe('register', function () {
        RPC.ping = () => ping;
    })
    describe('call', function () {
        return RPC('tcp:127.0.0.1:2333').ping().should.eventually.equal('ping');
    })
})
