let express = require("express");
let router = express.Router();

let { authenticated } = require("../middleware/authenticated");
let sendNotifications = require("../middleware/notification");
let { secretaryOnly } = require("../middleware/roleCheck");

/**
 * @summary
 * @param
 */
router.get("/", authenticated, (req, res) => {
    console.log(req.body);
});

/**
 * @summary
 */
router.post("/", authenticated, async (req, res, next) => {
    console.log(req.body);
});

/**
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
