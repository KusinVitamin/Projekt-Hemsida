const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");
const { create } = require("domain");

/**
 * @returns {Promise<string>} name of created volume
 */
async function createVolume() {
    const { stdout, stderr } = await exec(`docker volume create`);
    return removeEndOfLine(stdout);
}

/**
 *
 * @param {string} name Name of volume
 * @returns {Promise<string>} name of removed volume
 */
async function removeVolume(name) {
    if (name === "" || name === undefined) throw "Parameter name must be non-empty nor undefined!";
    const { stdout, stderr } = await exec(`docker volume rm ${name}`);
    return removeEndOfLine(stdout);
}

/**
 *
 * @param {string} image Name of image
 * @param {object} opts Object with options, see {@link https://docs.docker.com/engine/reference/commandline/create/ docs.docker.com} for a full list of options
 * @returns {string} name of created container
 */
async function createContainer(image, opts) {
    var baseCmd = "docker create";

    var options = "";
    for (const [key, value] of Object.entries(opts)) {
        // TODO Remove end of line from value and key
        options += `--${key} ${value} `;
    }
    // TODO Check if image exists

    const command = `${baseCmd} ${options} ${image}`;
    const { stdout, stderr } = await exec(command);
    return removeEndOfLine(stdout);
}

/**
 *
 * @param {string} str
 * @returns {string}
 */
function removeEndOfLine(str) {
    return str.replace(/\n$/, "");
}

module.exports = {
    createContainer,
    createVolume,
    removeVolume,
};
