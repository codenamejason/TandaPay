let express = require("express");
let router = express.Router();

let unimplemented = require("../controllers/unimplemented");

router.get("/", unimplemented);
router.post("/", unimplemented);
router.get("/:paymentID", unimplemented);

module.exports = router;
