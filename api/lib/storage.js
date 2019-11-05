let keys = require("../config/keys");
let { Storage } = require("@google-cloud/storage");

const FIFTEEN_MINUTES = 15 * 60 * 1000;

let bucket = null;
function setup() {
    // lazy instantiate GCP so test suite has time to mock it out
    let storage = new Storage({
        projectId: keys.googleKeyfile.project_id,
        keyFilename: keys.googleKeyfile.keyFilename,
    });
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
        contentType: "application/pdf",
        expires: Date.now() + FIFTEEN_MINUTES,
    }))[0];
    console.log(url);

    return url;
}

module.exports = { createUploadUrl };
