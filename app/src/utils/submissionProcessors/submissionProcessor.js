const path = require("path");
const fs = require("fs");
const AdmZip = require("adm-zip");

/**
 * Validates if the file has an allowed file extension. If the file extension is .zip, the zip will be
 * extracted to the directory where is is located.
 * @param {string} src Filepath to be validated
 * @param {Array<string>} allowedFileformats An array of allowed file extension. All extensions must begin with a dot, i.e. ".zip" or ".vhd".
 * @returns {Promise<string>} The directory name where the file is saved
 */
function extractAndValidateFile(src, allowedFileformats) {
    return new Promise(async (resolve, reject) => {
        const dir = path.dirname(src);
        const extension = path.extname(src);
        const fileIsZip = extension.toLowerCase() === ".zip";

        if (!fileformatIsAllowed(src, allowedFileformats)) {
            fs.rm(src, err => console.error(err));
            reject(`Fileformat "${extension}" is not allowed.`);
            return;
        }

        // Check all files in zip
        if (fileIsZip) {
            if (!(await zipContainsAllowedFiles(src, allowedFileformats))) {
                fs.rm(src, err => console.error(err));
                reject(`Fileformat "${extension}" is not allowed in zip.`);
                return;
            }
            await extractZip(src, dir);
            fs.rmSync(src);
        }

        resolve(dir);
    });
}

/**
 *
 * @param {string} src Path to zip file
 * @param {string} dest Path to where the contents of the zip file should be extracted
 * @returns {Promise<void>}
 */
function extractZip(src, dest) {
    return new Promise((resolve, reject) => {
        try {
            const zipFile = new AdmZip(src);
            zipFile.extractAllTo(dest, true);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

/**
 *
 * @param {string} src Path to zip file
 * @param {Array<string>} allowedFileformats Allowed file formats for entries in the zip
 * @returns
 */
async function zipContainsAllowedFiles(src, allowedFileformats) {
    // Create zip object
    const zip = new AdmZip(src);
    const zipEntries = zip.getEntries();

    // Iterate through entries
    for (let i = 0; i < zipEntries.length; i++) {
        const entry = zipEntries[i];
        const fileName = entry.entryName;
        const extension = path.extname(fileName);
        if (!allowedFileformats.includes(extension)) return false;
    }
    return true;
}

/**
 * Checks if file format is allowed
 * @param {string} oldpath path to the file to be checked
 * @param {Array<string>} allowedFileformats Array of allowed file formats
 * @returns {Boolean}
 */
function fileformatIsAllowed(oldpath, allowedFileformats) {
    var ext = path.extname(oldpath);
    return allowedFileformats.includes(ext);
}

module.exports = { extractAndValidateFile };
