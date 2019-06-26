let test = require("ava");
let sinon = require("sinon");

let { setupMongo, seedMongo } = require("../common");
function noop() {}

require("../../models/register");
let { authenticated } = require("../../middleware/authenticated.js");

let data;
test.before(async t => {
    await setupMongo();
    data = await seedMongo();
});

test("authenticated allows valid tokens", async t => {
    let req = { cookies: { "x-auth": data.bob.tokens[0].token } };
    let res = {};
    let next;

    let done = new Promise(res => (next = res));

    authenticated(req, res, next);

    await done;

    t.truthy(req.user);
});

test("authenticated disallows missing tokens", async t => {
    let req = { cookies: {} };
    let res = { status: sinon.fake.returns({ send: () => {} }) };
    let next = sinon.fake.returns();

    authenticated(req, res, next);

    t.is(next.callCount, 0);
    t.is(res.status.getCall(0).args[0], 401);
    t.falsy(req.user);
});

test("authenticated disallows invalid tokens", async t => {
    let req = { cookies: { "x-auth": "foo.bar.baz" } };
    let res = { status: null };
    let next = sinon.fake.returns();

    let done = new Promise(resolve => {
        res.status = sinon.fake.returns({ send: resolve });
    });

    authenticated(req, res, next);

    await done;

    t.is(next.callCount, 0);
    t.is(res.status.getCall(0).args[0], 401);
    t.falsy(req.user);
});
