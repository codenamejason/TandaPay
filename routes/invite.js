let express = require("express");
let router = express.Router();

let unimplemented = require("../controllers/unimplemented");
let { authenticated } = require("../middleware/authenticated");
let { secretaryOnly } = require("../middleware/roleCheck");

router.post("/", authenticated, secretaryOnly, unimplemented);

module.exports = router;
