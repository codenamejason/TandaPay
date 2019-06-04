let uuid = require('uuid/v4')
let { Storage } = require("@google-cloud/storage");

const FIFTEEN_MINUTES = 15 * 60 * 1000;

let storage = new Storage();
let bucket = storage.bucket(process.env.GOOGLE_BUCKET_NAME);

/**
 * @summary: Upload controller...
 * @param req: The Express request object
 * @param res: The Express response object
 * @param next: The Express next function
 * @returns: void
 */
async function uploadController(req, res, next) {
    let name = uuid();
    let file = bucket.file(name);
    let url = (await file.getSignedUrl({
        action: "write",
        expires: Date.now() + FIFTEEN_MINUTES,
    }))[0];
    res.status(200).send(url + '\n');
}

module.exports = uploadController;
