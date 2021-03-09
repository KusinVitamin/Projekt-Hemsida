const fs = require("fs");

/**
 *
 * @param {string} projectFile
 * @param {Array<string>} sources
 * @returns {Promise<void>}
 */
async function addSourceFilesToProject(projectFile, sources) {
    let fileSet = "";
    sources.forEach(filename => {
        fileSet += `<File Path="$PPRDIR/upload/${filename}">
                    <FileInfo>
                      <Attr Name="UsedIn" Val="synthesis"/>
                      <Attr Name="UsedIn" Val="simulation"/>
                    </FileInfo>
                  </File>`;
    });

    fs.readFile(projectFile, (err, data) => {
        const projectFileContent = data.toString("utf-8");
        const newProjectFileContent = projectFileContent.replace("@sources_1", fileSet);

        fs.writeFile(projectFile, newProjectFileContent, err => {});
    });
}
