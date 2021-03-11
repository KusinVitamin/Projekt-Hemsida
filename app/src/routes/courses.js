const express = require("express");
const router = express.Router();
const db = require("../mysql");
const uploader = require("../utils/uploader");
const path = require("path");
const submissionProcessor = require("../utils/submissionProcessors/submissionProcessor");
const vivadoGrader = require("../utils/grader/vivadoGrader");
const vivadoTestFactory = require("../utils/testFactories/vivadoTestFactory");

// Get all courses
router.get("/", async (req, res) => {
    try {
        const courses = await db.getCourses();
        res.render("index", { courses, title: "Mina kurser", session: req.session });
    } catch (error) {
        console.log(error.sqlMessage);
        res.render("error", { error: "Something went wrong!" });
    }
});

// Get all assignments for a course
router.get("/:cid", async (req, res) => {
    try {
        const cid = Number(req.params.cid);
        const assignments = await db.getAssignments(cid);
        const course = await db.getCourse(cid);

        res.render("assignments", { course, assignments, title: "Mina uppgifter", session: req.session });
    } catch (error) {
        console.log(error.sqlMessage);
        res.send("Something went wrong!");
    }
});

// Get an assignment by id for a course
router.get("/assignment/:aid", async (req, res) => {
    try {
        const aid = Number(req.params.aid);
        const uid = req.session.uid;
        let assignment = await db.getAssignment(aid);
        const fileExtensions = await db.getAllowedFileformats(aid);
        const submissions = await db.getSubmissions(aid, uid);

        assignment.fileExtensions = fileExtensions;
        assignment.submissions = submissions;
        res.render("assignment", { assignment, title: assignment.name, session: req.session });
        //res.send(assignment);
    } catch (error) {
        console.log(error.sqlMessage);
        res.send("Something went wrong!");
    }
});

// Form to upload a submission
router.get("/assignment/:aid/submit", async (req, res) => {
    const aid = Number(req.params.aid);
    const uid = req.session.uid;

    res.render("addSubmission", { title: "Create submission", session: req.session });
});

// Form handler for uploading a submission
router.post("/assignment/:aid/submit", async (req, res) => {
    const aid = Number(req.params.aid);
    const uid = req.session.uid;
    const formFieldName = "fileUpload";

    try {
        const sid = await db.insertSubmission(uid, aid);
        // const submission = await db.getSubmission(sid);
        const allowedFileformats = await db.getAllowedFileformats(aid);
        const submissionPath = path.join(process.env.FILEPATH_SUBMISSIONS, sid.toString());

        const uploadedFile = await uploader.saveFile(req, submissionPath, formFieldName);
        const submissionFile = await submissionProcessor.extractAndValidateFile(uploadedFile, allowedFileformats);

        await db.addFileToSubmission(sid, submissionFile);

        vivadoGrader
            .grade(sid, uid)
            .then(result => db.gradeSubmission(sid, result.grade, result.feedback, "success"))
            .catch(reason => {
                console.log(`Grading of submission #${sid} failed, reason being ${reason}`);
                db.gradeSubmission(sid, "", "", "failed");
            });

        res.redirect(`/submission/${sid}`);
    } catch (error) {
        console.log(error.sqlMessage);
        const message = "Something went wrong!";
        res.render("addSubmission", { message, title: "Create submission", session: req.session });
        return;
    }
});

// Form to change testbench file for an assignment
router.get("/assignment/:aid/testbench/change", async (req, res) => {
    const aid = Number(req.params.aid);
    const assignment = await db.getAssignment(aid);
    const course = await db.getCourse(assignment.course);

    res.render("changeTestbench", { assignment, course, title: "Change testbench", session: req.session });
});

// Form handler to change testbench file for an assignment
router.post("/assignment/:aid/testbench/change", async (req, res) => {
    const aid = Number(req.params.aid);
    const assignment = await db.getAssignment(aid);
    const testbench = await uploader.saveFile(req, process.env.FILEPATH_TEMP, "fileUpload");

    let testbenchSavePath;
    if (assignment.testsuitePath === null) {
        testbenchSavePath = await vivadoTestFactory.create(aid, testbench);
    } else {
        testbenchSavePath = await vivadoTestFactory.changeTestbench(aid, testbench);
    }
    await db.changeTestbenchPathOfAssignment(aid, testbenchSavePath);
    res.redirect(`/assignment/${aid}/testbench/change`);
});

// Get an submission by id
router.get("/submission/:sid", async (req, res) => {
    try {
        const sid = Number(req.params.sid);
        const uid = req.session.uid;

        const submission = await db.getSubmission(sid, uid);
        submission.statusIsPending = submission.testStatus.toLowerCase() === "pending";
        const assignment = await db.getAssignment(submission.assignment);
        res.render("submission", { submission, assignment, title: "Mina uppgifter", session: req.session });
        //res.send(submission);
    } catch (error) {
        console.log(error.sqlMessage);
        res.send("Something went wrong!");
    }
});

// Form for creating a new assignment
router.get("/new/assignment/:cid", async (req, res) => {
    res.render("addAssignment", { title: "Change testbench", session: req.session });
});

// Form handler for creating a new assignment
router.post("/new/assignment/:cid", async (req, res) => {
    const name = req.body.name;
    const duedate = new Date(req.body.duedate);
    const allowedFileFormats = req.body.fileFormats.replace(/ /g, "").split(",");
    const cid = Number(req.params.cid);

    const aid = await db.insertAssignment(cid, name, duedate);
    for (const fileFormat of allowedFileFormats) {
        db.insertAllowedFileformats(aid, fileFormat);
    }
    res.redirect(`/assignment/${aid}`);
});

// Form for adding a new course
router.get("/new/course/", async (req, res) => {
    res.render("addCourse", { title: "Add new course", session: req.session });
});

// Form handler for creating a new course
router.post("/new/course/", async (req, res) => {
    const name = req.body.name;
    const code = req.body.code;

    let success = false;
    let message = "";
    try {
        await db.insertCourse(name, code);
        success = true;
    } catch (error) {
        console.log(error.sqlMessage);
    }

    if (!success) {
        message = "Something went wrong!";
    }
    res.render("addCourse", { message, title: "Add new course", session: req.session });
});

module.exports = router;
