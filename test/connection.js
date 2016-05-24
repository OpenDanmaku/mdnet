const internal = require('../src/connection/connection-internal.js');
const should = require('chai').should();

describe('connection', function () {
    describe('internal', function () {
        describe('.connect', function () {
            let conn = internal.connect('tcp:127.0.0.1:1234');
        })
    })
})
