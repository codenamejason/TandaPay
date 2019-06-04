let { Storage } = require("@google-cloud/storage");

const FIFTEEN_MINUTES = 15 * 60 * 1000;

let storage = new Storage();
let bucket = storage.bucket(process.env.GOOGLE_BUCKET_NAME);

async function createUploadUrl(name) {
    let file = bucket.file(name);

    let url = (await file.getSignedUrl({
        action: "write",
        expires: Date.now() + FIFTEEN_MINUTES,
    }))[0];

    return url;
}

module.exports = { createUploadUrl };
