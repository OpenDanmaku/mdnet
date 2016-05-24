/**
 * Split endpoint string
 * @param {string} endpoint string representation of endpoint
 * @return {array} splitted endpoint
 */
function splitEndpoint(endpoint) {
    let result = [];
    for (let i = 0; i < endpoint.length; i++) {
        if (endpoint[i] === '[') {
            let j = i + 1;
            while (j < endpoint.length && (endpoint[j] !== ':' || endpoint[j - 1] !== ']')) j++;
            if (endpoint[j - 1] !== ']') {
                throw new TypeError('malformed endpoint');
            }
            result.push(endpoint.slice(i + 1, j - 1));
            i = j;
        } else {
            let j = i;
            while (j < endpoint.length && endpoint[j] !== ':') j++;
            result.push(endpoint.slice(i, j));
            i = j;
        }
    }
    return result;
}

const protocols = {
    tcp: require('./tcp.js'),
    // id: require('./id.js'),
}

/**
 * Create connection
 * @param {string} endpoint - endpoint descriptor
 * @return {Promise.<Connection>}
 */
function connect(endpoint) {
    let splittedEndpoint = splitEndpoint(endpoint);
    if (protocols[splittedEndpoint[0]] === undefined) {
        throw new Error('unsupported protocol');
    }
    return protocols[splittedEndpoint[0]].connect(splittedEndpoint);
}

module.exports = { connect, splitEndpoint };
