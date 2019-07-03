let test = require("ava");
let { setupAll, sleep } = require("../common");

let { http, data } = setupAll(test);
let User = require("../../models/User.js");

test("GET /user/settings - gets a user's notification settings", async t => {
    let res = await http()
        .get("/user/settings")
        .set("Authorization", "Bearer " + data.bob.tokens[0].token);

    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /json/);
    t.true(Array.isArray(res.body));
    t.true(res.body.length > 0);
    t.deepEqual(res.body, JSON.parse(JSON.stringify(data.bob.settings)));
});

test("PUT /user/settings - sets a user's notification settings", async t => {
    let res = await http()
        .put("/user/settings")
        .set("Authorization", "Bearer " + data.bob.tokens[0].token)
        .send([
            { code: "claim_approved", domain: "email", value: true },
            { code: "claim_approved", domain: "sms", value: true },
            { code: "example", domain: "email", value: true },
            { code: "some_new_setting", domain: "sms", value: true },
        ]);
    t.is(res.statusCode, 200);

    let settingsFromDb = (await User.findById(data.bob._id)).settings;
    t.truthy(settingsFromDb.find(s => s.code == "some_new_setting"));
});

test("PUT /user/settings - rejects malformed requests", async t => {
    let res = await http()
        .put("/user/settings")
        .set("Authorization", "Bearer " + data.bob.tokens[0].token)
        .send([
            { code: "claim_approved", value: true },
            { code: "example", value: true },
            { code: "some_new_setting", value: true },
        ]);
    t.is(res.statusCode, 400);
});

test("GET & PUT /user/settings - rejects unauthenticated requests", async t => {
    let res;

    res = await http().get("/user/settings");
    t.is(res.statusCode, 401);

    res = await http()
        .put("/user/settings")
        .send([{ code: "example", value: true }]);
    t.is(res.statusCode, 401);
});
