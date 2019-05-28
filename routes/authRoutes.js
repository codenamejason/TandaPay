const express = require("express");

const router = express.Router();

router.get("/user", (req, res) => {
	console.log("GET /user");
	res.send("Hello World");
});
module.exports = router;
