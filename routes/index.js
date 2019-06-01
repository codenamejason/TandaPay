let app = require("express")();

app.get("/version", (req, res) => {
    res.send(require("../package.json").version);
});

app.use("/claims", require("./claims"));

module.exports = app;
