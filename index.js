const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const PORT = process.env.PORT || 5000;
const keys = require("./config/keys");
require("./models/User");
// require("./services/passport");
const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(morgan("combined"));
app.use(bodyParser.json());
// app.use(passport.initialize());
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true
});

app.use("/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
