let mongoose = require("mongoose");
let crypto = require("crypto");
let Group = mongoose.model("groups");
const ObjectId = require("mongodb").ObjectID;
const Subgroup = require("../models/Subgroup");
let Premium = mongoose.model("premiums");
let { sendEmail } = require("../lib/twilio");
let invitationTemplate = require("../templates/invite.html.js");

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
 * @summary: create sub-group
 * @param req: The Express request object
 * @param res: The Express response object
 * @returns: group
 */
// members: { $exists: true },
// $where: "this.members.length>1",
// subgroups: { $exists: true },
// $where: "this.subgroups.members.length<7",
async function newSubGroupController(req, res) {
    let { subName, group_id } = req.body;
    let { name, _id } = req.user;

    let group = await Group.findOne({
        _id: group_id,
        "subgroups.members.id": { $nin: _id },

        "members.id": _id,
    });

    if (group == null) {
        return res
            .status(400)
            .send({ error: "You're not eligible to create a subgroup" });
    }

    let subgroup = {
        name: subName,
        leader: _id,
        members: [
            {
                id: _id,
                name: name,
            },
        ],
    };

    // if (group.subgroups.length > 0) {
    //     console.log("i used unshift");
    //
    //     group.subgroups.unshift(subgroup);
    // } else {
    //     console.log("i used push");
    //
    // }
    group.subgroups.push(subgroup);
    await group.save();
    return res.status(200).send(group);
}
async function accessGroupController(req, res) {
    let { accessCode } = req.body;
    let group = await Group.findOne({
        accessCode,
    });

    if (group == null || group == "") {
        return res.status(400).send({ isLegit: false });
    }

    return res.status(200).send({
        isLegit: true,
        charterID: group.charterID,
        groupName: group.groupName,
    });
}

async function fetchPremiumsController(req, res) {
    const { groupID } = req.user;

    let premium = await Premium.find({ groupID });

    if (premium == null || premium == "") {
        return res.status(200).send(null);
    } else {
        return res.status(200).send(premium);
    }
}
/**
 * @summary: join sub-group
 * @param req: The Express request object
 * @param res: The Express response object
 * @returns: group
 */

async function premiumPaymentController(req, res) {
    let premium = new Premium(req.body);
    await premium.save();
    res.status(200).send({ done: true });
}
async function joinSubGroupController(req, res) {
    let { sub_id, group_id } = req.body;
    let { name, _id } = req.user;
    let unwrap = sub_id.split("-");
    let subId = unwrap[0];
    let index = unwrap[1];

    let group = await Group.findOne({
        _id: group_id,
        "subgroups._id": subId,
        "members.id": _id,
        "subgroups.members.id": { $nin: _id },
    });

    if (group == null || group == "") {
        return res
            .status(400)
            .send({ error: "You're not eligible to join a subgroup" });
    }

    let joinsubgroup = {
        id: _id,
        name: name,
    };

    if (group.subgroups[index].isLock) {
        return res.status(400).send({ error: "This subgroup is lock." });
    }
    group.subgroups[index].members.push(joinsubgroup);
    let membersCount = group.subgroups[index].members.length;
    if (membersCount > 7) {
        return res
            .status(400)
            .send({ error: "Maximum number of participant reached" });
    }
    await group.save();
    return res.status(200).send(group);
}
async function contractGroupController(req, res) {
    let { cAddress } = req.body;

    let { groupID } = req.user;

    Group.updateOne(
        { _id: groupID },
        {
            $set: {
                contract: cAddress,
            },
        },
        function(err) {
            console.log(err);
        }
    ).then(s => {
        Group.findOne(groupID).then(doc => {
            return res.status(200).send(doc);
        });
    });
}
async function lockSubGroupController(req, res) {
    let { groupID, _id } = req.user;

    Group.findOne({ _id: groupID })
        .then(doc => {
            for (var i = 0; i < doc.subgroups.length; i++) {
                if (doc.subgroups[i].leader.toString() == _id.toString()) {
                    Group.updateOne(
                        { "subgroups._id": doc.subgroups[i]._id },
                        {
                            $set: {
                                "subgroups.$.isLock": true,
                            },
                        },
                        function(err) {}
                    ).then(s => {
                        Group.findOne({ _id: groupID }).then(doc => {
                            return res.status(200).send(doc);
                        });
                    });
                }
            }

            // item["name"] = "new name";
            // item["value"] = "new value";

            // doc.save();

            //sent respnse to client
        })
        .catch(err => {
            //console.log("Oh! Dark", err);
        });
}
async function leaveSubGroupController(req, res) {
    let { groupID, _id } = req.user;
    Group.findOne({ _id: groupID }, function(err, org) {
        let found = false;
        for (var i = 0; i < org.subgroups.length; i++) {
            if (found) break;

            for (var y = 0; y < org.subgroups[i].members.length; y++) {
                let user = org.subgroups[i].members[y].id;
                if (user.toString() == _id.toString()) {
                    found = true;

                    org.subgroups[i].members.pull({
                        _id: org.subgroups[i].members[y]._id,
                    });
                    let rs = org.save();

                    rs.then(s => {
                        return res.status(200).send(s);
                    });

                    break;
                }
            }
        }
    });
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
    let { groupName, premium, charterID, allowedClaims } = req.body;

    if (!groupName) {
        return res.status(400).send({ error: "groupName required" });
    }

    if (!premium) {
        return res.status(400).send({ error: "premium required" });
    }

    if (!charterID) {
        // TODO: also check that charterID is a valid id
        return res.status(400).send({ error: "charter required" });
    }

    if (isNaN(premium) || premium < 0) {
        return res.status(400).send({ error: "invalid premium" });
    }

    if (isNaN(allowedClaims) || allowedClaims < 1) {
        return res
            .status(400)
            .send({ error: "invalid expected number of claims" });
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
            charterID,
            allowedClaims,
            groupStanding: "okay",
            subgroups: [],
            accessCode: generateAccessCode(),
        });
        await group.save();

        secretary.groupID = group._id;
        await secretary.save();

        res.status(200).send(group);
    } catch (e) {
        res.status(500).send({ error: "internal server error" });
    }

    next();
}

/**
 * @summary: Creates an invitation to a group
 * @param req: The Express request object
 * @param res: The Express response object
 * @param next: The Express next function
 * @returns: void
 */
async function inviteToGroupController(req, res, next) {
    let secretary = req.user;

    let { groupID } = req.params;
    if (!groupID) {
        return res.status(400).send({ error: "no :id" });
    }

    let userEmail = req.body.email;
    if (!userEmail) {
        return res.status(400).send({ error: "missing email" });
    }

    if (!/\S+@\S+\.\S+/.test(userEmail)) {
        return res.status(400).send({ error: "invalid email" });
    }

    let group = await Group.findById(groupID);
    if (!group) {
        return res.status(404).send({ error: "no such group" });
    }

    if (group.secretary.email != secretary.email) {
        return res
            .status(403)
            .send({ error: "you don't have access to this group" });
    }

    let html = invitationTemplate({
        group: group.groupName,
        secretary: secretary.name,
        url: "https://tandapay-255615.appspot.com",
        code: group.accessCode,
    });

    await sendEmail(
        userEmail,
        "You've been invited to a group on TandaPay",
        html
    );

    res.status(200).send({ success: true });
}

/**
 * @summary generates an access code
 * this can generate 4,294,967,296 unique access codes
 */
function generateAccessCode() {
    return crypto.randomBytes(4).toString("hex");
}

module.exports = {
    getGroupByIDController,
    newGroupController,
    inviteToGroupController,
    newSubGroupController,
    joinSubGroupController,
    accessGroupController,
    leaveSubGroupController,
    lockSubGroupController,
    contractGroupController,
    premiumPaymentController,
    fetchPremiumsController,
};
