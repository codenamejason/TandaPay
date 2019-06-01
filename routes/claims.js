let express = require("express");
let router = express.Router();

let sendNotifications = require("../controllers/notification");

router.post(
    "/",
    async (req, res, next) => {
        req.claimantID = req.query.userID;
        req.tandaID = req.query.tandaID;

        res.set("Content-Type", "application/json");
        res.send("{}");

        next();
    },
    sendNotifications("claim_created")
);

module.exports = router;
