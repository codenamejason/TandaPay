let express = require("express");
let router = express.Router();

let uploadController = require("../controllers/upload");
let { authenticated } = require("../middleware/authenticated");

router.post("/", authenticated, uploadController);

module.exports = router;
