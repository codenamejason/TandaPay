let test = require("ava");
let { setupAll, sleep } = require("../common");

let { fake, http, data } = setupAll(test);

let Group = require("../../models/Group");

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

test.serial("GET /groups/:id - gets a group by ID", async t => {
    let res = await http()
        .get("/groups/" + data.group._id)
        .set("Cookie", "x-auth=" + data.bob.tokens[0].token);

    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /json/);
    t.truthy(res.body.secretary);
    t.truthy(res.body.members);
});

test.serial("POST /groups/new - creates a new group", async t => {
    let res = await http()
        .post("/groups/new")
        .set("Cookie", "x-auth=" + data.alice.tokens[0].token)
        .send({ groupName: "test group", premium: "20.00" });

    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /json/);
    t.truthy(res.body._id);
    t.truthy(res.body.secretary);
    t.truthy(res.body.members);

    t.truthy(await Group.findById(res.body._id));
});

test.serial("POST /groups/:id/invite - sends invitation to group", async t => {
    let res = await http()
        .post(`/groups/${data.group._id}/invite`)
        .set("Cookie", "x-auth=" + data.alice.tokens[0].token)
        .send({ email: "claire@example.org" });

    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /json/);
    t.true(fake.sendEmail.callCount > 0);
    t.regex(fake.sendEmail.getCall(0).args[2], /test-access-code/);
});
