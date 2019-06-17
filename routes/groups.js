let express = require("express");
let router = express.Router();

let { authenticated } = require("../middleware/authenticated");
let { secretaryOnly } = require("../middleware/roleCheck");
let {
    getGroupByIDController,
    newGroupController,
} = require("../controllers/group");
let unimplemented = require("../controllers/unimplemented");

router.get("/:groupID", authenticated, getGroupByIDController);
router.post("/new", authenticated, secretaryOnly, newGroupController);
router.post("/invite", authenticated, unimplemented);

module.exports = router;
