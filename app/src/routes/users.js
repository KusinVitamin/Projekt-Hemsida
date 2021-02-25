const express = require("express");
const router = express.Router();
const db = require("../mysql");

router.get("/", async (req, res) => {
    try {
        const users = await db.getUsers();
        res.send(users);
    } catch (error) {
        console.log(error.sqlMessage);
        res.send("Something went wrong!");
    }
});

router.post("/", async (req, res) => {
    try {
        await db.insertUser(req.body.email);
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

module.exports = router;
