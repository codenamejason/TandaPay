require("dotenv").config();

const PORT = process.env.PORT || 8080;

let api = require("./routes");

api.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
