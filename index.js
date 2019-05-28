const PORT = process.env.PORT || 8080;

let api = require("./lib/routes");

api.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
