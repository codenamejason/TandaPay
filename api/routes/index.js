let app = require("express")();
const bodyParser = require("body-parser");

//middleware
app.use(require("cookie-parser")());
app.use(bodyParser.json());
app.get("/version", (req, res) => {
    res.send(require("../package.json").version);
});

app.use("/claims", require("./claims"));
app.use("/payments", require("./payments"));
app.use("/groups", require("./groups"));
app.use("/user", require("./user"));
app.use("/upload", require("./upload"));

module.exports = app;
