const express = require("express");
const router = express.Router();
const db = require("../mysql");
const uploader = require("../utils/uploader");
const path = require("path");

// Get all courses
// GET /courses/
router.get("/", async (req, res) => {
    try {
        const courses = await db.getCourses();
        res.send(courses);
    } catch (error) {
        console.log(error.sqlMessage);
        res.send("Something went wrong!");
    }
});

// Get all assignments for a course
// GET /courses/<cid>
router.get("/:cid", async (req, res) => {
    try {
        const assignments = await db.getAssignments(req.params.cid);
        res.send(assignments);
    } catch (error) {
        console.log(error.sqlMessage);
        res.send("Something went wrong!");
    }
});

// Get an assignment by id for a course
// GET /courses/<cid>/<aid>
router.get("/:cid/:aid", async (req, res) => {
    try {
        const cid = Number(req.params.cid);
        const aid = Number(req.params.aid);
        let assignment = await db.getAssignment(cid, aid);
        const fileExtensions = await db.getAllowedFileformats(req.params.aid);

        assignment.fileExtensions = fileExtensions;
        res.send(assignment);
    } catch (error) {
        console.log(error.sqlMessage);
        res.send("Something went wrong!");
    }
});

// Create a new course
// POST /courses
router.post("/", async (req, res) => {
    try {
        await db.insertCourses(req.body.name);
        res.send("200 OK");
    } catch (error) {
        console.log(error.sqlMessage);
        res.send("Something went wrong!");
    }
});

// Create an assignment for a course
// POST /courses/<cid>
router.post("/:cid/", async (req, res) => {
    try {
        await db.insertAssignment(req.body);
        res.send("200 OK");
    } catch (error) {
        console.log(error.sqlMessage);
        res.send("Something went wrong!");
    }
});

router.get("/:cid/:aid/file", (req, res) => {
    res.send(`
    <h2>With <code>"express"</code> npm package</h2>
    <form enctype="multipart/form-data" method="post">
      <div>File: <input type="file" name="filetoupload" multiple="multiple" /></div>
      <input type="submit" value="Upload" />
    </form>
    `);
});

router.post("/:cid/:aid/file", async (req, res, next) => {
    const cid = req.params.cid;
    const aid = req.params.aid;
    const uid = 1;

    var p = await Promise.all([db.getCourse(cid), db.getAssignment(cid, aid), db.getUser(uid)]);
    const course = p[0].name;
    const assignment = p[1].name;
    const user = p[2].username;
    const fileName = "upload.txt";

    const newpath = path.join(process.env.FILEPATH_SUBMISSIONS, course, user, assignment, fileName);
    const formFieldName = "filetoupload";
    await uploader.saveFile(req, newpath, formFieldName);
    await db.insertSubmission(uid, aid, newpath);

    res.write("File uploaded and moved!");
    res.end();
});

router.put("/:id/", async (req, res) => {
    console.log(`${req.body}`);
    res.send({ status: 200, message: "OK" });
});

// Edit an assignment for a course
router.put("/:id/", async (req, res) => {
    console.log(`${req.body}`);
    res.send({ status: 200, message: "OK" });
});

module.exports = router;
