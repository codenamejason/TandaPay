let express = require("express");
const mongoose = require("mongoose");
const Claim = mongoose.model("claims");
let router = express.Router();

let { authenticated } = require("../middleware/authenticated");
let sendNotifications = require("../middleware/notification");
let { secretaryOnly } = require("../middleware/roleCheck");

const testGroupID = "5d06880d06763164987e29ed";
/**
 * REMOVE WHEN GROUP CREATION WORKS
 *
/**
 * @alias GET /claims/
 * @summary - After the user has been authenticated, it will return all claims associated with that user's group
 * @param {String} groupID - Object ID for the group the user's a member of. It will be found in the user object.
 * @param {Object} user - model instance of the authenticated user.
 *
 */
router.get("/", authenticated, async (req, res) => {
    const { _id, name } = req.user;
    const claimsByGroup = await Claim.find({ groupID: testGroupID });
    console.log(claimsByGroup);
    res.send(claimsByGroup);
});

/**
 * @alias POST /claims/
 * @summary
 * @param {String} groupID -
 * @param {Object} user
 */
router.post("/", authenticated, async (req, res) => {
    const { _id, name } = req.user;
    const { summary, documents, amount } = req.body;
    const claim = new Claim({
        groupID: testGroupID,
        creatorID: _id,
        creatorName: name,
        summary,
        documents,
        status: "pending",
        claimAmount: amount,
    });
    await claim.save();
    res.status(200).send(claim);
});

/**
 * @alias GET /claims/:claimID
 * @summary
 * @param {String} claimID - ObjectID of the claim to retrieve
 * @param {Object} user - model instance of authenticated user.
 */
router.get("/:claimID", authenticated, (req, res) => {
    console.log(req.body);
});

/**
 * @summary
 */
router.patch("/:claimID", authenticated, (req, res) => {
    console.log(req.body);
});

/**
 * @summary
 */
router.post("/approve/:claimID", authenticated, secretaryOnly, (req, res) => {
    console.log(req.body);
});

module.exports = router;
