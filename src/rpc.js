const GeneratorFunction = (function* () {}).constructor;
const co = require('co');

const mdnet = require('./mdnet.js');
let connection;
let Message;
let env;

const RPCProxy = RPC;

let rpcid = 0;
let rpccb = {};
function remoteFunction(endpoint, name) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            let message = new Message('rpc');
            message.action = 'call';
            message.func = name;
            message.args = args;
            message.id = rpcid++;
            connection.send(endpoint, message);
            let timeout = setTimeout(() => {
                delete rpccb[message.id];
                reject(new Error('RPC timeout'))
            }, env.rpcTimeout * 1000);
            rpccb[message.id] = {resolve, reject, timeout};
        })
    };
}
const RPCMethods = {
    call: co.wrap(function* (message, nodeId) {
        try {
            let func = RPCProxy[message.func];
            let result = func.apply(null, message.args);
            if (result instanceof Promise || func instanceof GeneratorFunction) {
                result = yield result;
            }
            let rmessage = new Message('rpc');
            rmessage.action = 'return';
            rmessage.result = result;
            rmessage.id = message.id;
            connection.send(`id:${nodeId}`, rmessage);
        } catch (err) {
            let rmessage = new Message('rpc');
            rmessage.action = 'throw';
            rmessage.error = {
                message: err.message,
                name: err.name
            };
            rmessage.id = message.id;
            connection.send(`id:${nodeId}`, rmessage);
        }
    }),
    throw: function (message, nodeId) {
        let reject = rpccb[message.id].reject;
        delete rpccb[message.id];
        let err = new Error(message.error.message);
        err.name = message.error.name;
        reject(err);
    },
    return: function (message, nodeId) {
        let resolve = rpccb[message.id].resolve;
        delete rpccb[message.id];
        resolve(message.result);
    }
}

function RPC(endpoint) {
    return new Proxy({}, {
        get: function (target, property) {
            return remoteFunction(endpoint, property);
        }
    });
}

mdnet.registerModule('RPC', ['env', 'connection'], {
    init: function () {
        env = mdnet.env;
        connection = mdnet.connection;
        Message = connection.Message;

        connection.subscribe('rpc', function (message, nodeId) {
            let action = message.action;
            if (action !== 'call' && action !== 'return' && action !== 'throw') return;
            RPCMethods[action](message, nodeId);
        });

        mdnet.RPC = RPCProxy;
    }
});
module.exports = RPCProxy;
