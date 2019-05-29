let app = require("express")();

app.get("/version", (req, res) => {
    res.send(require("../package.json").version);
});

module.exports = app;
