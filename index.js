const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 5000;
const authRouter = require("./routes/authRoutes");

app.use(bodyParser);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
	res.send("In progress");
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
