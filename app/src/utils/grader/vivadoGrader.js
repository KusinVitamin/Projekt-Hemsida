const { logParser } = require("../../vivado");
const path = require("path");
const db = require("../../mysql");
const docker = require("../docker");

/**
 *
 * @param {number} sid
 * @param {number} uid
 * @returns
 */
async function grade(sid, uid) {
    // Submission details
    const submission = await db.getSubmission(sid, uid);
    const assignment = await db.getAssignment(submission.assignment);

    // Docker constants
    const imageName = "d0020e_xilinx:run_lab";
    const containerPath = {
        root: "/root/src",
        upload: "/root/src/upload",
        logFile: "/root/src/sim/xsim/simulate.log"
    };
    const hostPath = {
        submission: submission.filepath,
        testBench: assignment.testsuitePath,
        logFile: path.join(process.env.FILEPATH_SUBMISSIONS, sid.toString(), "/results/simulate.log")
    };

    // Docker flow
    const volumeId = await docker.createVolume();
    const containerId = await docker.createContainer(imageName, { volume: `${volumeId}:${containerPath.root}` });
    await docker.copyFileToVolume(containerId, hostPath.submission, containerPath.upload); // Copy submission
    await docker.copyFileToVolume(containerId, hostPath.testBench, containerPath.root); // Copy testbench
    await docker.startContainer(containerId);
    await docker.copyFileFromVolume(containerId, containerPath.logFile, hostPath.logFile); // Copy logfile
    await docker.removeContainer(containerId);
    await docker.removeVolume(volumeId);

    const errors = logParser(hostPath.logFile);
    if (errors?.length !== 0) {
        return { grade: "U", feedback: errors.join(", ") };
    }
    return { grade: "G#", feedback: "" };
}

module.exports = { grade };
