let express = require("express");
let router = express.Router();

let unimplemented = require("../controllers/unimplemented");
let { secretaryOnly } = require("../middleware/roleCheck");

router.post("/", secretaryOnly, unimplemented);

module.exports = router;
