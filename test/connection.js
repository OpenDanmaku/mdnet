const connection = require('../src/connection/connection.js');
const should = require('chai').should();

describe('connection', function () {
    describe('.Connection', function () {
        describe('#constructor', function () {
            let conn = new connection.Connection('tcp:127.0.0.1:1234');
            conn.endpoint.should.equal('tcp:127.0.0.1:1234');
        })
    })
})
