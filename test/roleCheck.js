let test = require("ava");
let sinon = require("sinon");

let {
    adminOnly,
    secretaryOnly,
    policyholderOnly,
} = require("../middleware/roleCheck.js");

function noop() {}

/*
 * ===== adminOnly =====
 */

test("adminOnly allows admins", t => {
    let req = { user: { role: "admin" } };
    let res = { status: sinon.fake.returns({ send: noop }) };
    let next = sinon.fake.returns();

    adminOnly(req, res, next);

    t.is(res.status.callCount, 0);
    t.is(next.callCount, 1);
});

test("adminOnly rejects secretaries", t => {
    let req = { user: { role: "secretary" } };
    let res = { status: sinon.fake.returns({ send: noop }) };
    let next = sinon.fake.returns();

    adminOnly(req, res, next);

    t.is(res.status.callCount, 1);
    t.is(res.status.getCall(0).args[0], 403);
    t.is(next.callCount, 0);
});

test("adminOnly rejects policyholders", t => {
    let req = { user: { role: "policyholder" } };
    let res = { status: sinon.fake.returns({ send: noop }) };
    let next = sinon.fake.returns();

    adminOnly(req, res, next);

    t.is(res.status.callCount, 1);
    t.is(res.status.getCall(0).args[0], 403);
    t.is(next.callCount, 0);
});

/*
 * ===== secretaryOnly =====
 */

test("secretaryOnly allows secretaries", t => {
    let req = { user: { role: "secretary" } };
    let res = { status: sinon.fake.returns({ send: noop }) };
    let next = sinon.fake.returns();

    secretaryOnly(req, res, next);

    t.is(res.status.callCount, 0);
    t.is(next.callCount, 1);
});

test("secretaryOnly rejects admins", t => {
    let req = { user: { role: "admin" } };
    let res = { status: sinon.fake.returns({ send: noop }) };
    let next = sinon.fake.returns();

    secretaryOnly(req, res, next);

    t.is(res.status.callCount, 1);
    t.is(res.status.getCall(0).args[0], 403);
    t.is(next.callCount, 0);
});

test("secretaryOnly rejects policyholders", t => {
    let req = { user: { role: "policyholder" } };
    let res = { status: sinon.fake.returns({ send: noop }) };
    let next = sinon.fake.returns();

    secretaryOnly(req, res, next);

    t.is(res.status.callCount, 1);
    t.is(res.status.getCall(0).args[0], 403);
    t.is(next.callCount, 0);
});

/*
 * ===== policyholderOnly =====
 */

test("policyholderOnly allows policyholders", t => {
    let req = { user: { role: "policyholder" } };
    let res = { status: sinon.fake.returns({ send: noop }) };
    let next = sinon.fake.returns();

    policyholderOnly(req, res, next);

    t.is(res.status.callCount, 0);
    t.is(next.callCount, 1);
});

test("policyholderOnly rejects admins", t => {
    let req = { user: { role: "admin" } };
    let res = { status: sinon.fake.returns({ send: noop }) };
    let next = sinon.fake.returns();

    policyholderOnly(req, res, next);

    t.is(res.status.callCount, 1);
    t.is(res.status.getCall(0).args[0], 403);
    t.is(next.callCount, 0);
});

test("policyholderOnly rejects secretaries", t => {
    let req = { user: { role: "secretary" } };
    let res = { status: sinon.fake.returns({ send: noop }) };
    let next = sinon.fake.returns();

    policyholderOnly(req, res, next);

    t.is(res.status.callCount, 1);
    t.is(res.status.getCall(0).args[0], 403);
    t.is(next.callCount, 0);
});

/*
 * ===== sanity checks =====
 */

test("roleCheck middleware rejects unknown roles", t => {
    let req = { user: { role: "developer" } };
    let res = { status: sinon.fake.returns({ send: noop }) };
    let next = sinon.fake.returns();

    policyholderOnly(req, res, next);

    t.is(res.status.callCount, 1);
    t.is(res.status.getCall(0).args[0], 403);
    t.is(next.callCount, 0);
});
