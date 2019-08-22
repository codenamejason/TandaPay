let express = require("express");
const mongoose = require("mongoose");
const Claim = mongoose.model("claims");
let router = express.Router();

let { authenticated } = require("../middleware/authenticated");
let sendNotifications = require("../middleware/notification");
let { secretaryOnly } = require("../middleware/roleCheck");

let {
    getAllClaims,
    createNewClaim,
    getClaimByID,
    updateClaimByID,
    approveClaimByID,
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
router.post("/", authenticated, createNewClaim);

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
 * @alias POST /approve/:claimID
 * @summary Approves a claim
 */
router.post("/approve/:claimID", authenticated, secretaryOnly, approveClaimByID);

module.exports = router;
