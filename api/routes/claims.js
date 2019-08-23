let express = require("express");
const mongoose = require("mongoose");
const Claim = mongoose.model("claims");
let router = express.Router();

let { authenticated } = require("../middleware/authenticated");
let sendNotifications = require("../middleware/notification");
let { secretaryOnly, policyholderOnly } = require("../middleware/roleCheck");

let {
    getAllClaims,
    createNewClaim,
    getClaimByID,
    updateClaimByID,
    approveClaimByID,
    denyClaimByID,
} = require("../controllers/claims");

/**
 * @alias GET /claims/
 * @summary - Get all claims associated with a user's group
 *
 */
router.get("/", authenticated, getAllClaims);

/**
 * @alias POST /claims/
 * @summary Creates a new claim
 */
router.post("/", authenticated, policyholderOnly, createNewClaim);

/**
 * @alias GET /claims/:claimID
 * @summary Gets a claim by ID
 */
router.get("/:claimID", authenticated, getClaimByID);

/**
 * @alias PATCH /claims/:claimID
 * @summary Updates a claim
 */
router.patch("/:claimID", authenticated, updateClaimByID);

/**
 * @alias POST /:claimID/approve
 * @summary Approves a claim
 */
router.post("/:claimID/approve", authenticated, secretaryOnly, approveClaimByID);

/**
 * @alias POST /:claimID/deny
 * @summary Approves a claim
 */
router.post("/:claimID/deny", authenticated, secretaryOnly, denyClaimByID);

module.exports = router;
