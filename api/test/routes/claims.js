let test = require("ava");
let { setupAll, sleep } = require("../common");

let { fake, http, data } = setupAll(test);

let Claim = require("../../models/Claim");

// TODO: invariant tests
// [x] all routes are authenticated
// [x] only policyholders can create claims
// [x] only secretaries can approve claims
// [x] only group members can see claims
// [x] claims can only be updated in the pending state
// [x] claim amount cannot be negative
// [ ] only the claimant can update their claim

// TODO: group serial tests together

test("GET /claims/:id - gets a claim by ID", async t => {
    let res = await http()
        .get("/claims/" + data.claim._id)
        .set("Authorization", "Bearer " + data.bob.tokens[0].token);

    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /json/);
    t.truthy(res.body.claimantID);
    t.truthy(res.body.amount);
    t.is(res.body._id, data.claim._id.toString());
});

test.serial("GET /claims - gets all claims for the user's group", async t => {
    let res = await http()
        .get("/claims")
        .set("Authorization", "Bearer " + data.bob.tokens[0].token);

    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /json/);
    t.is(res.body.length, 1);
    t.is(res.body[0]._id, data.claim._id.toString());
});

test.serial("POST /claims - creates a new claim", async t => {
    let res = await http()
        .post("/claims")
        .set("Authorization", "Bearer " + data.bob.tokens[0].token)
        .send({
            summary: 'Money please',
            documents: ['foo', 'bar', 'baz'],
            amount: 500,
        });

    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /json/);
    t.truthy(res.body._id);
    t.truthy(res.body.groupID);
    t.truthy(res.body.claimantID);
    t.truthy(res.body.claimantName);
    t.is(res.body.status, "pending");
    t.truthy(await Claim.findById(res.body._id));
});

test.serial("PATCH /claims/:id - updates claims", async t => {
    let res = await http()
        .patch("/claims/" + data.claim._id)
        .set("Authorization", "Bearer " + data.bob.tokens[0].token)
        .send({
            summary: "I would like money please thank you",
            amount: 750,
            documents: ["foo", "bar", "baz", "alpha", "beta", "gamma"],
        });

    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /json/);

    let claim = await Claim.findById(data.claim._id).lean();
    t.is(claim.summary, "I would like money please thank you");
    t.is(claim.amount, 750);
    t.deepEqual(claim.documents, ["foo", "bar", "baz", "alpha", "beta", "gamma"]);
});

test.serial("Claim amounts must be >0", async t => {
    let res;

    res = await http()
        .patch("/claims/" + data.claim._id)
        .set("Authorization", "Bearer " + data.bob.tokens[0].token)
        .send({ amount: -5 });
    t.is(res.statusCode, 400);

    res = await http()
        .patch("/claims/" + data.claim._id)
        .set("Authorization", "Bearer " + data.bob.tokens[0].token)
        .send({ amount: 0 });
    t.is(res.statusCode, 400);
});

test.serial("POST /claims/:id/approve - approves a claim", async t => {
    let res = await http()
        .post(`/claims/${data.claim._id}/approve`)
        .set("Authorization", "Bearer " + data.alice.tokens[0].token);

    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /json/);

    let claim = await Claim.findById(data.claim._id);
    t.is(claim.status, "approved");
});

test("Claim routes require authentication", async t => {
    let res;

    res = await http().get("/claims");
    t.is(res.statusCode, 401);

    res = await http().post("/claims");
    t.is(res.statusCode, 401);

    res = await http().get("/claims/" + data.claim._id);
    t.is(res.statusCode, 401);

    res = await http().patch("/claims/" + data.claim._id);
    t.is(res.statusCode, 401);

    res = await http().post("/claims/" + data.claim._id + "/approve");
    t.is(res.statusCode, 401);
});

test("Secretaries cannot create claims", async t => {
    let res = await http()
        .post("/claims")
        .set("Authorization", "Bearer " + data.alice.tokens[0].token)
        .send({
            summary: 'Money please',
            documents: ['foo', 'bar', 'baz'],
            amount: 500,
        });

    t.is(res.statusCode, 403);
});

test("Policyholders cannot approve claims", async t => {
    let res = await http()
        .post(`/claims/${data.claim._id}/approve`)
        .set("Authorization", "Bearer " + data.bob.tokens[0].token);

    t.is(res.statusCode, 403);
});

test("Users cannot see other groups' claims", async t => {
    let res;

    res = await http()
        .get("/claims/" + data.otherGroupsClaim._id)
        .set("Authorization", "Bearer " + data.alice.tokens[0].token);
    t.is(res.statusCode, 403);

    res = await http()
        .get("/claims/" + data.otherGroupsClaim._id)
        .set("Authorization", "Bearer " + data.bob.tokens[0].token);
    t.is(res.statusCode, 403);
});

test.serial("Claims can only be updated in the pending state", async t => {
    let res = await http()
        .patch("/claims/" + data.claim._id)
        .set("Authorization", "Bearer " + data.bob.tokens[0].token)
        .send({
            summary: "I would like money please thank you",
            amount: 750,
            documents: ["foo", "bar", "baz", "alpha", "beta", "gamma"],
        });
    t.is(res.statusCode, 403);
});
