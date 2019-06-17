let mongoose = require("mongoose");
let Group = mongoose.model("groups");

/**
 * @summary: Retrieves the group doc via the request's params
 * @param req: The Express request object
 * @param res: The Express response object
 * @param next: The Express next function
 * @returns: void
 */
async function getGroupByIDController(req, res, next) {
    let id = req.params.groupID;
    if (!id) {
        return res.status(400).send({ error: "no :id" });
    }

    let group = await Group.findById(id);
    if (!group) {
        return res.status(404).send({ error: "no such group" });
    }

    res.status(200).send(group);
}

module.exports = {
    getGroupByIDController,
};
