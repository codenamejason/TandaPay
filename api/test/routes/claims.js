let test = require("ava");
let { setupAll, sleep } = require("../common");

let { fake, http, data } = setupAll(test);

let Claim = require("../../models/Claim");

// TODO: invariant tests
// [ ] all routes are authenticated
// [ ] only policyholders can create claims
// [ ] only secretaries can approve claims
// [ ] only group members can see claims
// [ ] claims can only be updated in the pending state
// [ ] claim amount cannot be negative
// [ ] only the claimant can update their claim

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

test("PATCH /claims/:id - updates claims", async t => {
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

    // TODO: don't do another HTTP request, hit db directly
    res = await http()
        .get("/claims/" + data.claim._id)
        .set("Authorization", "Bearer " + data.bob.tokens[0].token);

    t.is(res.body.summary, "I would like money please thank you");
    t.is(res.body.amount, 750);
    t.deepEqual(res.body.documents, ["foo", "bar", "baz", "alpha", "beta", "gamma"]);
});

test("POST /claims/:id/approve - approves a claim", async t => {
    let res = await http()
        .post(`/claims/${data.claim._id}/approve`)
        .set("Authorization", "Bearer " + data.alice.tokens[0].token);

    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /json/);

    let claim = await Claim.findById(data.claim._id);
    t.is(claim.status, "approved");
});
