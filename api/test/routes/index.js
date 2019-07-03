let test = require("ava");
let { setupAll, sleep } = require("../common");

let { fake, http, data } = setupAll(test);

test("server starts (and reports version)", async t => {
    let res = await http().get("/version");

    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /json/);
    t.truthy(res.body.version);
    t.truthy(res.body.commit);
});
