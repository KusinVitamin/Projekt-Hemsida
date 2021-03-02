/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {import("express").NextFunction} next
 * @param {Function} outputFunc
 */
function logger(req, res, next, outputFunc) {
    var date = new Date();
    var now_utc = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
    );
    const method = req.method.toUpperCase();
    const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    const isoDateString = new Date(now_utc).toISOString();
    const logText = `${method} : ${url} : ${isoDateString}${require("os").EOL}`;
    outputFunc(logText);
    next();
}

module.exports = { logger };
