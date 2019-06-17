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
    next();
}

/**
 * @summary: Creates a new group
 * @param req: The Express request object
 * @param res: The Express response object
 * @param next: The Express next function
 * @returns: void
 */
async function newGroupController(req, res, next) {
    let secretary = req.user;
    let { groupName, premium } = req.body;

    if (!groupName) {
        return res.status(400).send({ error: "groupName required" });
    }

    if (!premium) {
        return res.status(400).send({ error: "premium required" });
    }

    try {
        let group = new Group({
            secretary: {
                name: secretary.name,
                email: secretary.email,
                phone: secretary.phone,
            },
            members: [
                {
                    id: secretary._id,
                    name: secretary.name,
                    standing: "good",
                },
            ],
            groupName,
            premium,
            groupStanding: "okay",
            subgroups: [],
        });

        await group.save();

        res.status(200).send(group);
    } catch (e) {
        res.status(500).send({ error: "internal server error" });
    }

    next();
}

module.exports = {
    getGroupByIDController,
    newGroupController,
};
