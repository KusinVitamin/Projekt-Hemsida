const express = require("express");
const exphbs = require("express-handlebars");
const logger = require("./middleware/logger").logger;
const methodOverride = require("method-override");
const session = require("express-session");
require("dotenv").config();

const app = express();

// Handlebars Middleware
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Session Middleware
app.use(
    session({
        secret: "ProjectAl",
        resave: false,
        saveUninitialized: true
    })
);

// Middleware
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => logger(req, res, next, console.log));
app.use((req, res, next) => {
    const fs = require("fs");
    const path = require("path");
    logger(req, res, next, data => {
        fs.appendFile(path.join(__dirname, "../log/http.log"), data, () => {});
    });
});

// Routers
app.use("/", require("./routes/courses"));
app.use("/oauth", require("./routes/oauth"));

// Set static content paths
app.use(express.static("public"));
app.use("/lcov", express.static("coverage/lcov-report"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
