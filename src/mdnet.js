const log = require('./log.js');
let mdnet = {};
mdnet.modules = {};

mdnet.registerModule = function (moduleName, dependencies, module) {
    mdnet.modules[moduleName] = {
        inited: false,
        dependencies: dependencies,
        module: module
    };
}

mdnet.init = function () {
    log.notify('mdnet', 'init');
    for (let moduleName in mdnet.modules) {
        mdnet.initModule(moduleName);
    }
}

mdnet.initModule = function (moduleName) {
    if (mdnet.modules[moduleName] === undefined) {
        throw new Error(`module '${moduleName}' is not found`);
    }
    if (mdnet.modules[moduleName].inited) return;
    for (let depName of mdnet.modules[moduleName].dependencies) {
        mdnet.initModule(depName);
    }
    log.notify('mdnet', `init module '${moduleName}'`);
    mdnet.modules[moduleName].module.init();
    mdnet.modules[moduleName].inited = true;
}

module.exports = mdnet;
