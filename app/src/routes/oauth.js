const express = require("express");
const router = express.Router();
const oauth = require("../utils/google-oauth");

const allowedDomains = ["student.ltu.se", "ltu.se"];

router.get("/google/signin", async (req, res) => {
    const token = req.query.token;
    if (token === undefined) {
        res.status(400);
        res.send("Bad Request: token is missing");
        return;
    }

    const verification = await oauth.verify(token, allowedDomains);
    if (!verification.authorized) {
        req.session.signedIn = false;
        res.status(403);
        res.send("Forbidden");
        return;
    }

    if (req.session.signedIn) {
        // User already signed in, no action required
        res.status(200);
        res.send();
    } else {
        // User authenticated, but no active session. Create session
        req.session.signedIn = true;
        res.status(201);
        res.send(`Welcome ${verification.username}`);
    }
});

router.get("/signout", async (req, res) => {
    req.session.signedIn = false;
    res.status(200);
    res.send("You're now signed out");
});

module.exports = router;
