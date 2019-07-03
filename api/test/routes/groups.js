let test = require("ava");
let { setupAll, sleep } = require("../common");

let { fake, http, data } = setupAll(test);

let Group = require("../../models/Group");

test.serial("GET /groups/:id - gets a group by ID", async t => {
    let res = await http()
        .get("/groups/" + data.group._id)
        .set("Authorization", "Bearer " + data.bob.tokens[0].token);

    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /json/);
    t.truthy(res.body.secretary);
    t.truthy(res.body.members);
});

test.serial("POST /groups/new - creates a new group", async t => {
    let res = await http()
        .post("/groups/new")
        .set("Authorization", "Bearer " + data.alice.tokens[0].token)
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
        .set("Authorization", "Bearer " + data.alice.tokens[0].token)
        .send({ email: "claire@example.org" });

    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /json/);
    t.true(fake.sendEmail.callCount > 0);
    t.regex(fake.sendEmail.getCall(0).args[2], /test-access-code/);
});

test("Group routes require authentication", async t => {
    let res;

    res = await http().get("/groups/" + data.group._id);
    t.is(res.statusCode, 401);
    t.regex(res.header["content-type"], /json/);

    res = await http().post("/groups/new");
    t.is(res.statusCode, 401);
    t.regex(res.header["content-type"], /json/);

    res = await http()
        .post(`/groups/${data.group._id}/invite`)
        .send({ email: "claire@example.org" });
    t.is(res.statusCode, 401);
    t.regex(res.header["content-type"], /json/);
});

test("Only the secretary can send invites", async t => {
    let res = await http()
        .post(`/groups/${data.group._id}/invite`)
        .set("Authorization", "Bearer " + data.bob.tokens[0].token)
        .send({ email: "claire@example.org" });

    t.is(res.statusCode, 403);
    t.regex(res.header["content-type"], /json/);
});

test("Policyholders cannot create groups", async t => {
    let res = await http()
        .post("/groups/new")
        .set("Authorization", "Bearer " + data.bob.tokens[0].token)
        .send({ groupName: "test group", premium: "20.00" });

    t.is(res.statusCode, 403);
    t.regex(res.header["content-type"], /json/);
});

test("Malformed groups are rejected", async t => {
    let res;

    res = await http()
        .post("/groups/new")
        .set("Authorization", "Bearer " + data.alice.tokens[0].token)
        .send({ groupName: null, premium: "20.00" });
    t.is(res.statusCode, 400);

    res = await http()
        .post("/groups/new")
        .set("Authorization", "Bearer " + data.alice.tokens[0].token)
        .send({ groupName: "cool group", premium: "cat" });
    t.is(res.statusCode, 400);

    res = await http()
        .post("/groups/new")
        .set("Authorization", "Bearer " + data.alice.tokens[0].token)
        .send({ groupName: "cool group", premium: "-5.00" });
    t.is(res.statusCode, 400);
});

test("Malformed invites are rejected", async t => {
    let res;

    res = await http()
        .post(`/groups/${data.group._id}/invite`)
        .set("Authorization", "Bearer " + data.alice.tokens[0].token)
        .send({ email: null });
    t.is(res.statusCode, 400);

    res = await http()
        .post(`/groups/${data.group._id}/invite`)
        .set("Authorization", "Bearer " + data.alice.tokens[0].token)
        .send({ email: "1 Infinite Loop, Cupertino CA" });
    t.is(res.statusCode, 400);
});
