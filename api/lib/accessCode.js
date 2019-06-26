let uuid = require('uuid/v4');

function generate() {
    return uuid();
}

module.exports = generate;
