const express = require("express");
const path = require("path");
const vivado = require("./vivado");
const methodOverride = require("method-override");
require("dotenv").config();

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));

// Some Routes
app.get("/error", (req, res) => res.send(`<pre>${vivado.logParser("./public/simulate.log")}</pre>`));
app.get("/", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(`<h2>Project AL</h2>`);
    res.write(`<ul>`);
    res.write(`<li><a href="/error">Vivado log parser test</a></li>`);
    res.write(`<li><a href="/courses">Courses</a></li>`);
    res.write(`<li><a href="/users">Users</a></li>`);
    res.write(`<ul>`);
    res.end();
});

// Routers
app.use("/users", require("./routes/users"));
app.use("/courses", require("./routes/courses"));
//app.use("/assignments", require("./routes/assignments"));

// Set static content paths
app.use(express.static("public"));
app.use("/lcov", express.static("coverage/lcov-report"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
