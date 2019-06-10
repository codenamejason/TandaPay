const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();

const PORT = process.env.PORT || 5000;
const keys = require("./config/keys");
require("./models/User");
require("./services/passport");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
mongoose.connect(keys.mongoURI, {
	useNewUrlParser: true
});

app.use("/auth", authRoutes);
app.use("/user/", userRoutes);
if (process.env.NODE_ENV === "production") {
	app.use(morgan("combined"));
	const path = require("path");
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}
let server = app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

module.exports = {
	server,
	app
};
