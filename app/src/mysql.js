const pool = require("./dbpool");

/**
 * Get assignments
 * @param {number} courseId
 * @returns {Promise<Array<object>>}
 */
function getAssignments(courseId) {
    return new Promise((resolve, reject) => {
        pool.query(
            "SELECT id, course, name, duedate FROM projectal.assignments WHERE ?",
            { course: courseId },
            (error, results, fields) => {
                if (error) reject(error);
                resolve(results);
            }
        );
    });
}

/**
 * Get an assignment for course
 * @param {number} courseId
 * @param {number} assignmentId
 * @returns {Promise<object>}
 */
function getAssignment(courseId, assignmentId) {
    return new Promise((resolve, reject) => {
        pool.query(
            "SELECT id, course, name, duedate FROM projectal.assignments WHERE course = ? and id = ?",
            [courseId, assignmentId],
            (error, results, fields) => {
                if (error) reject(error);
                if (results.length === 0) {
                    reject("Not found");
                }
                resolve(results[0]);
            }
        );
    });
}

/**
 * Insert a new assignment
 * @param {{course:number, name:string, duedate:Date}} assignment Assignment to insert into database
 * @returns {Promise<Boolean>} Returns true if the assignment was succesfully inserted, else an error will be thrown
 */
function insertAssignment(assignment) {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO projectal.assignments SET ?", assignment, (error, results, fields) => {
            if (error) reject(error);
            resolve(results);
        });
    });
}

/**
 * Get allowed fileformats for uploaded files in assignments
 * @param {number} assignmentId
 * @returns {Promise<Array<object>>}
 */
function getAllowedFileformats(assignmentId) {
    return new Promise((resolve, reject) => {
        pool.query(
            "SELECT id, extension FROM projectal.allowedFileformats WHERE ?",
            { aid: assignmentId },
            (error, results, fields) => {
                if (error) reject(error);
                resolve(results);
            }
        );
    });
}

function insertAllowedFileformats(aid, format) {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO projectal.allowedFileformats VALUES (?,?)", [aid, format], (error, results, fields) => {
            if (error) reject(error);
            resolve(results);
        });
    });
}

function getUsers() {
    return new Promise((resolve, reject) => {
        pool.query("SELECT id, email FROM projectal.users", (error, results, fields) => {
            if (error) reject(error);
            resolve(results);
        });
    });
}

//Gets courses
function getCourses() {
    return new Promise((resolve, reject) => {
        pool.query("SELECT id, name FROM projectal.courses", (error, results, fields) => {
            if (error) reject(error);
            resolve(results);
        });
    });
}

//Inserts new course
function insertCourses(name) {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO projectal.courses SET ?", { name }, (error, results, fields) => {
            if (error) reject(error);
            resolve(results);
        });
    });
}

function insertUser(email) {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO `projectal`.`users` SET ?", { email }, function (error, results, fields) {
            if (error) reject(error);
            resolve(results);
        });
    });
}

module.exports = {
    getUsers,
    getAssignment,
    getAssignments,
    getCourses,
    getAllowedFileformats,
    insertUser,
    insertAssignment,
    insertCourses,
    insertAllowedFileformats
};
