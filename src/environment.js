let mdnet = require('./mdnet.js');
/**
 * Environment variables
 * @module environment
 * @namespace
 */
let env = module.exports = {
    /** @namespace */
    key: {
        /** @type {Buffer} */
        public: Buffer('MYw1ZMeRroG9Zwlkxh/DRwvO754M3hVJbduwgZbuXZI=', 'base64'),
        /** @type {Buffer} */
        private: Buffer('sFQNPNInIVsSI9Db3yKFJ0bVwrBMRnJC/g8moZujDXvw+FE6TxFBUPSYYjke+cPCLn9Jzyf4UAKjzcbQKjIxWw==', 'base64')
    },
    connTimeout: 30,
    rpcTimeout: 30
};

mdnet.registerModule('env', [], {
    init: function () {
        mdnet.env = env;
    }
});
