let app = require("express")();

app.get("/version", (req, res) => {
    res.send(require("../package.json").version);
});

app.use("/claims", require("./claims"));
app.use("/payments", require("./payments"));
app.use("/groups", require("./groups"));
app.use("/invite", require("./invite"));
app.use("/user", require("./user"));

module.exports = app;
