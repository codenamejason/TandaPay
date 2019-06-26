let express = require("express");
let router = express.Router();

let { authenticated } = require("../middleware/authenticated");
let { secretaryOnly } = require("../middleware/roleCheck");
let {
    getGroupByIDController,
    newGroupController,
    inviteToGroupController,
} = require("../controllers/group");

router.post("/new", authenticated, secretaryOnly, newGroupController);
router.get("/:groupID", authenticated, getGroupByIDController);
router.post("/:groupID/invite", authenticated, inviteToGroupController);

module.exports = router;
