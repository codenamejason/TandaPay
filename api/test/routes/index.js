let test = require("ava");
let { setupAll, sleep } = require("../common");

let { fake, http, data } = setupAll(test);

test("server starts (and reports version)", async t => {
    let { version } = require("../../package.json");
    let res = await http().get("/version");

    t.is(res.statusCode, 200);
    t.is(res.text, version);
    t.regex(res.header["content-type"], /text/);
});
