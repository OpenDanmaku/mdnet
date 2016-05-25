const colors = require('colors/safe');
const levelNames = [ 'DEBUG', 'INFO', 'NOTIFY', 'WARN', 'ERROR', 'CRITICAL' ];
const levelColors = [ 'gray', 'white', 'cyan', 'yellow', 'red', 'magenta' ];

let minLevel = 0;

function log(level, tag, ...args) {
    if (level < minLevel) return;
    console.log(colors[levelColors[level]](colors.bold(`[${levelNames[level]}]`)), colors.underline(`<${tag}>`), ...args);
}

/** @module log */
module.exports = {
    /**
     * @function
     * @param {integer} level
     * @param {string} tag
     * @param {...*} information
     */
    log,
    /**
     * @function
     * @param {integer} level - minimal level to display
     */
    setMinLevel(level) { minLevel = level; },
    /**
     * @function
     * @param {string} tag
     * @param {...*} information
     */
    debug:      log.bind(null, 0),
    /**
     * @function
     * @param {string} tag
     * @param {...*} information
     */
    info:       log.bind(null, 1),
    /**
     * @function
     * @param {string} tag
     * @param {...*} information
     */
    nofity:     log.bind(null, 2),
    /**
     * @function
     * @param {string} tag
     * @param {...*} information
     */
    warn:       log.bind(null, 3),
    /**
     * @function
     * @param {string} tag
     * @param {...*} information
     */
    error:      log.bind(null, 4),
    /**
     * @function
     * @param {string} tag
     * @param {...*} information
     */
    critical:   log.bind(null, 5),
};
