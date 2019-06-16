let express = require("express");
let router = express.Router();

let unimplemented = require("../controllers/unimplemented");
let { authenticated } = require("../middleware/authenticated");
let { secretaryOnly } = require("../middleware/roleCheck");

router.get("/:groupID", authenticated, (req, res) => {});
router.post("/new", authenticated, secretaryOnly, (req, res) => {});
router.post("/invite", authenticated, (req, res) => {});
module.exports = router;
