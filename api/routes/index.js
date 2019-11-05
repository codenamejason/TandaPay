let app = require("express")();
let bodyParser = require("body-parser");
let cors = require("cors");

//middleware
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:5000",

            "https://tandapay-255615.appspot.com",
        ],
        optionsSuccessStatus: 200,
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);
app.use(require("cookie-parser")());
app.use(bodyParser.json());
app.get("/version", async (req, res) => {
    let { version } = require("../package.json");
    let commit = await new Promise((res, rej) =>
        require("child_process").exec("git rev-parse HEAD", (err, stdout) =>
            err ? rej(err) : res(stdout.trim())
        )
    );
    res.send({ version, commit });
});

app.use("/claims", require("./claims"));
app.use("/payments", require("./payments"));
app.use("/groups", require("./groups"));
app.use("/user", require("./user"));
app.use("/upload", require("./upload"));

module.exports = app;
