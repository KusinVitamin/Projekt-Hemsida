const fs = require("fs");

/**
 *
 * @param {string} path
 * @returns {Array<string>}
 */
function logParser(path) {
    var errors = [];
    var lines = fs.readFileSync(path).toString().split("\n");
    lines.forEach(line => {
        const match = /Error: (.*)/.exec(line);
        if (match != null) {
            errors.push(match[1]);
        }
    });
    return errors;
}

module.exports = { logParser };
