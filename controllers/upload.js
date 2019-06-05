let uuid = require("uuid/v4");
let { createUploadUrl } = require("../lib/storage.js");

/**
 * @summary: Upload controller generates signed upload urls
 * @param req: The Express request object
 * @param res: The Express response object
 * @param next: The Express next function
 * @returns: void
 */
async function uploadController(req, res, next) {
    let userID = req.user._id.toString();
    let filename = userID + "_" + uuid();
    let url = await createUploadUrl(filename);
    res.status(200).send({ id: name, url });
}

module.exports = uploadController;
