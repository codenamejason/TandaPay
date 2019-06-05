let express = require("express");
let router = express.Router();

let { authenticated } = require("../middleware/authenticated");
let { secretaryOnly } = require("../middleware/roleCheck");
let { getGroupByIDController } = require("../controllers/group");
let unimplemented = require("../controllers/unimplemented");

router.get("/:groupID", authenticated, getGroupByIDController);
router.post("/new", authenticated, secretaryOnly, (req, res) => {});
router.post("/invite", authenticated, (req, res) => {});

module.exports = router;
