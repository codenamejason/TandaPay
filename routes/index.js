let app = require("express")();

app.use(require("cookie-parser")());

app.get("/version", (req, res) => {
    res.send(require("../package.json").version);
});

app.use("/claims", require("./claims"));
app.use("/payments", require("./payments"));
app.use("/groups", require("./groups"));
app.use("/invite", require("./invite"));
app.use("/user", require("./user"));
app.use("/upload", require("./upload"));

module.exports = app;
