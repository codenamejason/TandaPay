let app = require("express")();

app.get("/", (req, res) => {
    res.send("hello world");
});

module.exports = app;
