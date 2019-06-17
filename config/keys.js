if (process.env.NODE_ENV === "production") {
    // we are in production
    module.exports = require("./prod");
} else if (process.env.NODE_ENV === "test") {
    // we are in test
    module.exports = require("./test");
} else {
    // we are in development
    module.exports = require("./dev");
}
