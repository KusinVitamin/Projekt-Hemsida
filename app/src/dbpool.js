var mysql = require("mysql");

/** @type {mysql.Pool} */
var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_database
});

module.exports = pool;
