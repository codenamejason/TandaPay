let express = require("express");

let router = express.Router();

let { authenticated } = require("../middleware/authenticated");
let { secretaryOnly, policyholderOnly } = require("../middleware/roleCheck");

let {
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
} = require("../controllers/group");

router.post("/subgroup", authenticated, newSubGroupController);
router.post("/joinsubgroup", authenticated, joinSubGroupController);
router.post("/new", authenticated, secretaryOnly, newGroupController);
router.post("/access", authenticated, accessGroupController);
router.post("/contract", authenticated, secretaryOnly, contractGroupController);
router.post(
    "/recordpremiumpayment",
    authenticated,
    policyholderOnly,
    premiumPaymentController
);
router.get("/fetchpremiums", authenticated, fetchPremiumsController);
premiumPaymentController;
router.post(
    "/lockSubgroup",
    authenticated,
    policyholderOnly,
    lockSubGroupController
);

router.post(
    "/leavesubgroup",
    authenticated,
    policyholderOnly,
    leaveSubGroupController
);

router.get("/:groupID", authenticated, getGroupByIDController);
router.post("/:groupID/invite", authenticated, inviteToGroupController);

module.exports = router;
