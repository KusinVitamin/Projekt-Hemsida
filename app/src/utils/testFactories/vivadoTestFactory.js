const path = require("path");
const fse = require("fs-extra");

/**
 *
 * @param {number} aid Path to save location
 * @param {string} testbench Path to user defined testbench
 * @returns {Promise<string>}
 */
async function create(aid, testbench) {
    return new Promise(async (resolve, reject) => {
        const testbenchRoot = path.join(process.env.FILEPATH_USER_DEFINED_TESTS, aid.toString(), path.sep);
        const vivadoTemplatePath = path.join(process.env.FILEPATH_TEST_TEMPLATES, "vivado/");
        const testbenchGenericPath = path.join(testbenchRoot, "testbench/lab_tb.vhd");

        // Kopiera mall till root
        await fse.copy(vivadoTemplatePath, testbenchRoot, { overwrite: true });

        // Kopiera testBench till root/testbench
        await fse.copy(testbench, testbenchGenericPath, { overwrite: true });

        resolve(testbenchRoot);
    });

    //? Lägg till testbench till projektfil *.xpr. Ej nödvändigt om generiskt namn på testbench används.
    //? Spara dir till databas. Ej nödvändigt om den sparas vid senare tillfälle. Undvika beroenden
}

/**
 *
 * @param {number} aid
 * @param {string} testbench
 * @returns {Prmoise<string>}
 */
async function changeTestbench(aid, testbench) {
    return new Promise(async (resolve, reject) => {
        await remove(aid);
        const testbenchPath = await create(aid, testbench);
        resolve(testbenchPath);
    });
}

/**
 *
 * @param {number} aid
 * @returns {Promise<void>}
 */
async function remove(aid) {
    return new Promise(async (resolve, reject) => {
        const testbenchRoot = path.join(process.env.FILEPATH_USER_DEFINED_TESTS, aid.toString());
        await fse.remove(testbenchRoot);
        resolve();
    });
}

module.exports = { changeTestbench, create, remove };

async function test() {
    require("dotenv").config();
    const testBench = "C:/Users/Rickard/Documents/GitHub/Projekt-Hemsida/docker/Vivado/lab3/testbench/ARITH_tb.vhd";
    const aid = 1;
    var x;
    x = await create(aid, testBench);
    x = await changeTestbench(aid, testBench);
    await remove(aid);
}
//test();
