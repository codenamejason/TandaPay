require("dotenv").config();

const PORT = process.env.PORT || 8080;
const { MONGO_URI } = process.env;

require("./models/register");
require("mongoose").connect(MONGO_URI, { useNewUrlParser: true });

const app = require("./routes");

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
