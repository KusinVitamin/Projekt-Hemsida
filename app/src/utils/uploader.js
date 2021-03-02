const formidable = require("formidable");
const path = require("path");
const fs = require("fs");

/**
 *
 * @param {Request} req Http request object
 * @param {string} dest File destination with name of file and file extension, ie. "path/to/myfile.txt"
 * @param {string} formFieldName Name of formfield that contains the file to save
 * @returns {Promise<void>}
 */
async function saveFile(req, dest, formFieldName) {
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }

        const oldpath = files[formFieldName].path;
        const newDirName = path.dirname(dest);
        if (!fs.existsSync(newDirName)) {
            await fs.promises.mkdir(newDirName, { recursive: true });
        }
        fs.rename(oldpath, dest, function (err) {
            if (err) throw err;
        });
    });
}

module.exports = { saveFile };
