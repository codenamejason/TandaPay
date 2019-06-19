let test = require("ava");
let { setupAll, sleep } = require("../common");

let { fake, http, data } = setupAll(test);

test.serial("POST /upload - generates upload urls", async t => {
    let res = await http()
        .post("/upload")
        .set("Cookie", "x-auth=" + data.bob.tokens[0].token);

    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /json/);
    t.truthy(res.body.id);
    t.truthy(res.body.url);
    t.true(res.body.url.startsWith("http"));
    t.true(fake.upload.callCount > 0);
});
