let express = require("express");
let router = express.Router();

let unimplemented = require("../controllers/unimplemented");
let { authenticated } = require("../middleware/authenticated");
let sendNotifications = require("../middleware/notification");
let { secretaryOnly } = require("../middleware/roleCheck");

router.get("/", unimplemented);
router.post(
    "/",
    authenticated,
    async (req, res, next) => {
        req.claimantID = req.query.userID;
        req.tandaID = req.query.tandaID;

        // TODO: actually to jwt & database stuff

        res.set("Content-Type", "application/json");
        res.send("{}");

        next();
    },
    sendNotifications("claim_created")
);
router.get("/:claimID", unimplemented);
router.patch("/:claimID", unimplemented);
router.post("/approve/:claimID", authenticated, secretaryOnly, unimplemented);

module.exports = router;
