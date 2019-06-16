let { Storage } = require("@google-cloud/storage");
const keys = require("../config/keys");
const FIFTEEN_MINUTES = 15 * 60 * 1000;
let storage = new Storage({
    projectId: keys.googleKeyfile.project_id,
    keyFilename: "keyfile.json",
});

let bucket = null;
function setup() {
    // lazy instantiate GCP so test suite has time to mock it out
    bucket = storage.bucket(keys.googleBucketName);
}

/**
 * @summary: Generates a presigned upload url
 * @param name: The file name
 * @returns: Promise<url>
 */
async function createUploadUrl(name) {
    if (bucket == null) setup();
    let file = bucket.file(name);

    let url = (await file.getSignedUrl({
        action: "write",
        expires: Date.now() + FIFTEEN_MINUTES,
    }))[0];

    return url;
}

module.exports = { createUploadUrl };
