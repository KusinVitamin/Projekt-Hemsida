const pool = require("./dbpool");
// todo Prevent SQL injection
// todo Create strongly typed return objects
// todo Write basic documentation with JSDOC

/**
 * Get assignments
 * @param {number} courseId
 * @returns {Promise<Array<{id:number, course:number, name:string, duedate:Date}>>}
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
 * @param {number} assignmentId
 * @returns {Promise<{id:number, testsuitePath:string, course:number, name:string, duedate:Date} | undefined>}
 */
function getAssignment(assignmentId) {
    return new Promise((resolve, reject) => {
        pool.query(
            "SELECT id, testsuitePath, course, name, duedate FROM projectal.assignments WHERE id = ?",
            [assignmentId],
            (error, results, fields) => {
                if (error) reject(error);
                if (results.length === 0) {
                    resolve(undefined);
                } else {
                    let assignment = results[0];
                    assignment.testbenchIsNull = assignment.testsuitePath === null;
                    resolve(assignment);
                }
            }
        );
    });
}

/**
 *
 * @param {number} aid assignmentid
 * @param {number} uid userid
 * @returns {Promise<Array<{id:number, assignment:number, user:number, grade:string, feedback:string, filepath:string, testStatus:string, dateAdded:Date }| undefined>>}
 */
function getSubmissions(aid, uid) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `SELECT id, assignment, user, grade, feedback, filepath, testStatus, dateAdded 
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
 * @returns {Promise<{id:number, assignment:number, user:number, grade:string, feedback:string, filepath:string, testStatus:string, dateAdded:Date } | undefined>}
 */
function getSubmission(sid, uid) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `SELECT id, assignment, user, grade, feedback, filepath, testStatus, dateAdded 
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
 * @returns {Promise<Array<{uid:number, email:string}>>}
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
 * @returns {Promise<number>} id of inserted assignment
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
            resolve(results.insertId);
        });
    });
}

/**
 * Get allowed fileformats for uploaded files in assignments
 * @param {number} assignmentId
 * @returns {Promise<Array<{id:number, extension:string}>>}
 */
function getAllowedFileformats(assignmentId) {
    return new Promise((resolve, reject) => {
        pool.query(
            "SELECT id, extension FROM projectal.allowedFileformats WHERE ?",
            { aid: assignmentId },
            (error, results, fields) => {
                if (error) reject(error);
                if (results.length === 0) {
                    resolve([]);
                    return;
                }

                var allowedFileformats = [];
                results.forEach(row => {
                    allowedFileformats.push(row.extension);
                });
                resolve(allowedFileformats);
            }
        );
    });
}

/**
 *
 * @param {number} aid
 * @param {string} format
 * @returns {Promise<number>} Id of inserted allowed fileformat
 */
function insertAllowedFileformats(aid, format) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO projectal.allowedFileformats SET ?";
        const params = { aid, extension: format };

        pool.query(query, params, (error, results, fields) => {
            if (error) reject(error);
            resolve(results.insertId);
        });
    });
}

/**
 *
 * @returns {Promise<Array<{id:number, username:string, email:string}>>}
 */
function getUsers() {
    return new Promise((resolve, reject) => {
        pool.query("SELECT id, username, email FROM projectal.users", (error, results, fields) => {
            if (error) reject(error);
            resolve(results);
        });
    });
}

/**
 * Gets the userdetails of a student, given his id
 * @param {number} uid
 * @returns {Promise<{id:number, username:string, email:string} | undefined>}
 */
function getUser(uid) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT id, username, email FROM projectal.users WHERE id=?", uid, (error, results, fields) => {
            if (error) reject(error);
            if (results.length === 0) {
                resolve(undefined);
            } else {
                resolve(results[0]);
            }
        });
    });
}

/**
 * Gets courses
 * @returns {Promise<Array<{id:number, name:string, code:string>>}}
 */
function getCourses() {
    return new Promise((resolve, reject) => {
        pool.query("SELECT id, name, code FROM projectal.courses", (error, results, fields) => {
            if (error) reject(error);
            resolve(results);
        });
    });
}

/**
 * Gets course
 * @param {number} cid courseid
 * @returns {Promise<{id:number, name:string, code:string} | undefined>}
 */
function getCourse(cid) {
    return new Promise((resolve, reject) => {
        const query = "SELECT id, name, code FROM projectal.courses WHERE id = ?";
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

/**
 *
 * @param {number} aid assignmentId
 * @param {string} testbench Path to testbench
 * @returns {Promise<void>}
 */
function changeTestbenchPathOfAssignment(aid, testbench) {
    return new Promise((resolve, reject) => {
        pool.query(
            "UPDATE projectal.assignments SET testsuitePath = ? WHERE id = ?",
            [testbench, aid],
            (error, results, fields) => {
                if (error) reject(error);
                resolve();
            }
        );
    });
}

/**
 * Inserts new course
 * @param {string} name Userfriendly name without course code
 * @param {string} code
 * @returns {Promise<number>} Id of inserted course
 */
function insertCourse(name, code) {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO projectal.courses SET ?", { name, code }, (error, results, fields) => {
            if (error) reject(error);
            resolve(results.insertId);
        });
    });
}

/**
 *
 * @param {string} email
 * @param {string} username
 * @returns {Promise<number>} Id of inserted user
 */
function insertUser(email, username) {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO `projectal`.`users` SET ?", { email, username }, (error, results, fields) => {
            if (error) reject(error);
            resolve(results.insertId);
        });
    });
}

/**
 * Assigns a role to a user
 *
 * @param {number} roleId
 * @param {number} userId
 * @param {number} courseId
 * @returns {Promise<number>} Id of roleclaim
 */
function assignRole(roleId, userId, courseId) {
    const role = {
        id: roleId,
        name: userId,
        course: courseId
    };
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO projectal.RoleClaims SET ?", { role }, (error, results, fields) => {
            if (error) reject(error);
            resolve(results.insertId);
        });
    });
}

/**
 * Revokes a given role from a given user, from a given course
 * @param {number} roleId
 * @param {number} userId
 * @param {number} courseId
 * @returns {Promise<void>}
 */
function revokeRole(roleId, userId, courseId) {
    return new Promise((resolve, reject) => {
        pool.query(
            "DELETE FROM projectal.RoleClaims WHERE id=? AND user=? AND course=?",
            [roleId, userId, courseId],
            (error, results, fields) => {
                if (error) reject(error);
                resolve();
            }
        );
    });
}

/**
 * Submits an assignment
 * @param {number} uid
 * @param {number} aid
 * @param {string} path
 * @returns {Promise<number>} Id of inserted submission
 */
function insertSubmission(uid, aid) {
    return new Promise((resolve, reject) => {
        pool.query(
            "INSERT INTO projectal.Submissions (assignment, user, testStatus) VALUES (?,?,?)",
            [aid, uid, "Pending"],
            (error, results, fields) => {
                if (error) reject(error);
                resolve(results.insertId);
            }
        );
    });
}

/**
 *
 * @param {number} sid
 * @param {string} grade
 * @param {string} feedback
 * @param {'success'|'failed'} testStatus
 * @returns {Promise<void>}
 */
function gradeSubmission(sid, grade, feedback, testStatus) {
    return new Promise((resolve, reject) => {
        pool.query(
            "UPDATE projectal.submissions SET grade = ?, feedback = ?, testStatus = ? WHERE id = ?;",
            [grade, feedback, testStatus, sid],
            (error, results, fields) => {
                if (error) reject(error);
                resolve();
            }
        );
    });
}

/**
 *
 * @param {number} sid
 * @param {string} filepath
 * @returns {Promise<void>}
 */
function addFileToSubmission(sid, filepath) {
    return new Promise((resolve, reject) => {
        pool.query(
            "UPDATE projectal.submissions SET filepath = ? WHERE id = ?",
            [filepath, sid],
            (error, results, fields) => {
                if (error) reject(error);
                resolve();
            }
        );
    });
}

module.exports = {
    addFileToSubmission,
    changeTestbenchPathOfAssignment,
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
    insertCourse,
    insertAllowedFileformats,
    assignRole,
    revokeRole,
    getUser,
    insertSubmission,
    gradeSubmission
};
