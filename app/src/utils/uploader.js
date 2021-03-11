const formidable = require("formidable");
const path = require("path");
const fs = require("fs");

/**
 *
 * @param {Request} req Http request object
 * @param {string} dest Destination folder where the file will be saved
 * @param {string} formFieldName Name of formfield that contains the file to save
 * @returns {Promise<string>} Full path to the file, including filename
 */
async function saveFile(req, dest, formFieldName) {
    return new Promise((resolve, reject) => {
        const form = formidable({ multiples: false });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                reject(err);
            }

            const oldpath = files[formFieldName].path;
            const oldFilename = files[formFieldName].name;
            const savedFilePath = path.join(dest, oldFilename);
            if (!fs.existsSync(dest)) {
                await fs.promises.mkdir(dest, { recursive: true });
            }
            fs.rename(oldpath, savedFilePath, function (err) {
                if (err) reject(err);
                resolve(savedFilePath);
            });
        });
    });
}

module.exports = { saveFile };
