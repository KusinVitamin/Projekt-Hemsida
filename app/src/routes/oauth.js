const express = require("express");
const router = express.Router();
const oauth = require("../utils/google-oauth");

const allowedDomains = ["student.ltu.se", "ltu.se"];

router.get("/google/signin", async (req, res) => {
    const token = req.query.token;
    const redirectUrl = req.query.redirect;
    if (token === undefined) {
        res.status(400);
        res.send("Bad Request: token is missing");
        return;
    }

    const verification = await oauth.verify(token, allowedDomains);
    if (!verification.authorized) {
        res.status(403);
        res.send("Forbidden");
        return;
    }

    // TODO Check redirectUri
    // TODO Set session signedIn status to true
    if (redirectUrl === undefined) {
        res.status(200);
        res.send(`Welcome ${verification.username}`);
    } else {
        res.redirect(redirectUrl);
    }
});

router.get("/signout", async (req, res) => {
    // TODO Clear session or set signedIn status to false
    res.send("You're now signed out");
});

module.exports = router;
