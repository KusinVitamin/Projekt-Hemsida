const express = require("express");
const router = express.Router();
const db = require("../mysql");

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
