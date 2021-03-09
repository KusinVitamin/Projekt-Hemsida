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
    //if (!checkDockerString(name)) throw `Parameter name is not valid, must be on form ${RestrictedNameChars}`;

    const { stdout, stderr } = await exec(`docker volume rm ${name}`);
    return removeEndOfLine(stdout);
}

/**
 *
 * @param {string} image Name of image
 * @param {object} opts Object with options, see {@link https://docs.docker.com/engine/reference/commandline/create/ docs.docker.com} for a full list of options
 * @returns {string} Id of created container
 */
async function createContainer(image, opts = {}) {
    //if (!checkDockerString(image)) throw `Parameter name is not valid, must be on form ${RestrictedNameChars}`;
    if (!imageExists(image)) throw `Image ${image} does not exist!`;

    var baseCmd = "docker create";

    var options = "";
    for (const [key, value] of Object.entries(opts)) {
        if (containsNewLine(key)) throw "Key must not contain any linefeeds";
        if (containsNewLine(value)) throw "Value must not contain any linefeeds";

        options += `--${key} ${value} `;
    }

    const command = `${baseCmd} ${options} ${image}`;
    const { stdout, stderr } = await exec(command);
    return removeEndOfLine(stdout);
}

/**
 *
 * @param {string} containerId Name of the container
 * @returns {???}
 */
async function startContainer(containerId) {
    if (containerId === "" || containerId === undefined) throw "Parameter containerName cannot be empty or undefined!";

    var baseCmd = "docker container start";
    var options = "-a";

    const command = `${baseCmd} ${options} ${containerId}`;
    try {
        await exec(command);
        return true;
    } catch (error) {
        return false;
    }
}

async function removeContainer(containerId) {
    if (containerId === "" || containerId === undefined) throw "Parameter containerId cannot be empty or undefined!";
    if (!(await containerExists(containerId))) throw `A container with id ${containerId} was not found`;

    const command = `docker container rm ${containerId}`;
    const { stdout, stderr } = await exec(command);
}

/**
 *
 * @param {string} containerId Id of container
 * @param {string} src Path of file to copy
 * @param {string} dest Path in container where file at src is saved. Must be a root path
 */
async function copyFileToVolume(containerId, src, dest) {
    if (containerId === "" || containerId === undefined) throw "Parameter containerId must be non-empty nor undefined!";
    if (dest === "" || dest === undefined) throw "Parameter dest must be non-empty nor undefined!";
    if (!fs.existsSync(src)) throw `File at ${src} does not exist!`;

    const command = `docker cp "${src}" ${containerId}:${dest}`;
    await exec(command);
}

/**
 *
 * @param {string} containerId Id of container
 * @param {string} src Path to file in container to copy. Must be a root path
 * @param {string} dest Path in host to save file at
 */
async function copyFileFromVolume(containerId, src, dest) {
    if (containerId === "" || containerId === undefined) throw "Parameter containerId must be non-empty nor undefined!";
    if (dest === "" || dest === undefined) throw "Parameter dest must be non-empty nor undefined!";
    //if (!fs.existsSync(src)) throw `File at ${src} does not exist!`;

    const command = `docker cp ${containerId}:${src} "${dest}"`;
    await exec(command);
}

/**
 *
 * @param {string} name Name of image
 * @returns {boolean}
 */
async function imageExists(name) {
    if (name === "" || name === undefined) throw "Parameter name must be non-empty nor undefined!";
    // Command returns image id
    const { stdout, stderr } = await exec(`docker images -q ${name}`);
    // No image exists, image id will be empty
    return stdout.length !== 0;
}

/**
 *
 * @param {string} id Id of container
 */
async function containerExists(id) {
    if (id === "" || id === undefined) throw "Parameter id must not be empty nor undefined!";
    const { stdout, stderr } = await exec("docker container ls -a --no-trunc");
    const stdoutArr = stdout.split("\n");
    for (let i = 0; i < stdoutArr.length; i++) {
        const foundId = stdoutArr[i].substr(0, id.length);
        if (foundId === id) return true;
    }
    return false;
}

/**
 *
 * @param {string} str
 * @returns {string}
 */
function removeEndOfLine(str) {
    return str.replace(/\n$/, "");
}

/**
 *
 * @param {string} str
 * @returns {boolean} true if the string contains a linefeed, else false.
 */
function containsNewLine(str) {
    return /\r|\n/.test(str);
}

module.exports = {
    copyFileFromVolume,
    copyFileToVolume,
    createContainer,
    createVolume,
    removeVolume,
    removeContainer,
    startContainer
};
