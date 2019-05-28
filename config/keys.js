if (process.env.NODE_ENV === "production") {
  // we are in production
  module.exports = require("./prod");
} else {
  // We are in development or test environment
  module.exports = require("./dev");
}
