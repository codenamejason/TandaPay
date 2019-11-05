let express = require("express");

let router = express.Router();
//router.use(cors());
let { authenticated } = require("../middleware/authenticated");
let { secretaryOnly } = require("../middleware/roleCheck");
let {
    getGroupByIDController,
    newGroupController,
    inviteToGroupController,
    newSubGroupController,
    joinSubGroupController,
} = require("../controllers/group");

router.post("/subgroup", authenticated, newSubGroupController);
router.post("/joinsubgroup", authenticated, joinSubGroupController);
router.post("/new", authenticated, secretaryOnly, newGroupController);
router.get("/:groupID", authenticated, getGroupByIDController);
router.post("/:groupID/invite", authenticated, inviteToGroupController);

module.exports = router;
