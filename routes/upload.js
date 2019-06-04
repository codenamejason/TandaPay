let express = require("express");
let router = express.Router();

let uploadController = require("../controllers/upload");

router.post("/", uploadController);

module.exports = router;
