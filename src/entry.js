const log = require('./log.js');
process.on('uncaughtException', (e) => log.error('uncaught', e.stack));
process.on('unhandledRejection', (e) => log.error('uncaught', e.stack));

let mdnet = require('./mdnet');
require('./env.js');

mdnet.init();

// then perform 3-stage bootstrap
