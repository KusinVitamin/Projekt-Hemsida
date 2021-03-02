const pool = require("./dbpool");
// todo Prevent SQL injection
// todo Create strongly typed return objects
// todo Write basic documentation with JSDOC

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
 *
 * @param {number} aid assignmentid
 * @param {number} uid userid
 * @returns {Promise<Array<object>>}
 */
function getSubmissions(aid, uid) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `SELECT id, assignment, user, grade, feedback 
            FROM projectal.submissions 
            WHERE assignment = ? and user = ?`;
        const params = [aid, uid];
        pool.query(sqlQuery, params, (error, results, fields) => {
            if (error) reject(error);
            resolve(results);
        });
    });
}

/**
 *
 * @param {number} sid submissionid
 * @param {number} uid userid
 * @returns {Promise<object | undefined>}
 */
function getSubmission(sid, uid) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `SELECT id, assignment, user, grade, feedback 
            FROM projectal.submissions 
            WHERE id = ? and user = ?`;
        const params = [sid, uid];

        pool.query(sqlQuery, params, (error, results, fields) => {
            if (error) reject(error);

            // If no submission was found return undefined, else the first result
            if (results.length === 0) {
                resolve(undefined);
            } else {
                resolve(results[0]);
            }
        });
    });
}

/**
 *
 * @param {number} cid courseid
 * @returns {Promise<Array<object>>}
 */
function getCourseParticipants(cid) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `SELECT C.uid, U.email FROM projectal.courseparticipants as C
            INNER JOIN projectal.users as U on U.id = C.uid
            WHERE cid = ?`;
        const params = [cid];

        pool.query(sqlQuery, params, (error, results, fields) => {
            if (error) reject(error);
            resolve(results);
        });
    });
}

/**
 * Insert a new assignment
 * @param {number} courseId
 * @param {string} name
 * @param {Date} duedate
 * @returns {Promise<Boolean>} Returns true if the assignment was succesfully inserted, else an error will be thrown
 */
function insertAssignment(courseId, name, duedate) {
    const assignment = {
        course: courseId,
        name: name,
        duedate: duedate
    };
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

/**
 *
 * @param {number} aid
 * @param {string} format
 */
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

/**
 * Gets the LTU username of a student, given his id
 * @param {number} uid
 * @returns {Promise<object>}
 */
function getUser(uid) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT username, email FROM projectal.users WHERE id=?", uid, (error, results, fields) => {
            if (error) reject(error);
            if (results.length === 0) reject("User not found");
            resolve(results[0]);
        });
    });
}

/**
 * Gets courses
 */
function getCourses() {
    return new Promise((resolve, reject) => {
        pool.query("SELECT id, name FROM projectal.courses", (error, results, fields) => {
            if (error) reject(error);
            resolve(results);
        });
    });
}

/**
 * Gets course
 * @param {number} cid courseid
 * @returns {Promise<object | undefined>}
 */
function getCourse(cid) {
    return new Promise((resolve, reject) => {
        const query = "SELECT id, name FROM projectal.courses WHERE id = ?";
        const params = [cid];

        pool.query(query, params, (error, results, fields) => {
            if (error) reject(error);
            if (results?.length === 0) {
                resolve(undefined);
            } else {
                resolve(results[0]);
            }
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

function insertUser(email, username) {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO `projectal`.`users` SET ?", { email, username }, (error, results, fields) => {
            if (error) reject(error);
            resolve(results);
        });
    });
}

/**
 * Assigns a role to a user
 *
 * @param {number} roleId
 * @param {number} userId
 * @param {number} courseId
 *
 */
function assignRole(roleId, userId, courseId) {
    const role = {
        id: roleId,
        name: userId,
        course: courseId
    };
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO projectal.RoleClaims SET ?", role, (error, results, fields) => {
            if (error) reject(error);
            resolve(results);
        });
    });
}

/**
 * Revokes a given role from a given user, from a given course
 * @param {number} roleId
 * @param {number} userId
 * @param {number} courseId
 */
function revokeRole(roleId, userId, courseId) {
    return new Promise((resolve, reject) => {
        pool.query(
            "DELETE FROM projectal.RoleClaims WHERE id=? AND name=? AND course=?",
            [roleId, userId, courseId],
            (error, results, fields) => {
                if (error) reject(error);
                resolve(results);
            }
        );
    });
}

/**
 * Submits an assignment
 * @param {number} uid
 * @param {number} aid
 * @param {string} path
 */
function insertSubmission(uid, aid, path) {
    return new Promise((resolve, reject) => {
        pool.query(
            "INSERT INTO projectal.Submissions (assignment, user, filepath) VALUES (?,?,?)",
            [aid, uid, path],
            (error, results, fields) => {
                if (error) reject(error);
                resolve(results);
            }
        );
    });
}

/**
 *
 * @param {number} sid
 * @param {string} grad
 * @param {string} feed
 */
function gradeSubmission(sid, grad, feed) {
    return new Promise((resolve, reject) => {
        pool.query(
            "INSERT INTO projectal.Submissions (grade, feedback) VALUES (?,?) WHERE id=?",
            [grad, feed, sid],
            (error, results, fields) => {
                if (error) reject(error);
                resolve(results);
            }
        );
    });
}

module.exports = {
    getAssignment,
    getAssignments,
    getAllowedFileformats,
    getCourse,
    getCourses,
    getCourseParticipants,
    getSubmission,
    getSubmissions,
    getUsers,
    insertUser,
    insertAssignment,
    insertCourses,
    insertAllowedFileformats,
    assignRole,
    revokeRole,
    getUser,
    insertSubmission,
    gradeSubmission
};
