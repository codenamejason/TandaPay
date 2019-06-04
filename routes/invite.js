let express = require("express");
let router = express.Router();

let unimplemented = require("../controllers/unimplemented");

router.post("/", unimplemented);

module.exports = router;
