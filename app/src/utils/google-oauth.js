const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.OAUTH_GOOGLE_CLIENT_ID);

/**
 * Verify access token and authorize user if access token is valid.
 * @param {string} token
 * @param {string} userid
 * @param {Array<string>} allowedDomains Allowed domains in which the user must belong to to be verified
 * @returns {Promise<{validToken:boolean, authorized?:boolean, username?:string, email?:string}>}
 */
async function verify(token, allowedDomains) {
    let ticket;
    try {
        ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.OAUTH_GOOGLE_CLIENT_ID
        });
    } catch (error) {
        return { validToken: false };
    }
    const payload = ticket.getPayload();
    const domain = payload["hd"];
    const email = payload["email"];
    const username = email.substring(0, email.indexOf("@"));
    const authorized = allowedDomains.includes(domain);

    if (!authorized) {
        return { validToken: true, authorized: false };
    }
    return {
        validToken: true,
        authorized: true,
        username,
        email
    };
}

module.exports = { verify };
