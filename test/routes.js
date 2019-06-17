let test = require("ava");
let sinon = require("sinon");
let request = require("supertest");
let mongoose = require("mongoose");
let MemoryMongo = require("mongo-in-memory");

// set up sinon mocks before local requires
let { fake_sendSMS, fake_sendEmail, fake_upload } = sinonSetup();
let alice, bob;

require("../models/register");
let app = require("../routes");
let http = () => request(app);

// set up in memory MongoDB before tests run
test.before(async t => {
    let mongo = new MemoryMongo();

    // ugh, callbacks
    await new Promise((res, rej) =>
        mongo.start(err => (err ? rej(err) : res()))
    );

    let uri = mongo.getMongouri("test");
    mongoose.connect(uri, { useNewUrlParser: true });

    await mongoSetup();
});

// NOTE: All tests that check the state of fake_'s need to run in .serial mode
// so call state can be reset between tests
test.beforeEach(t => {
    sinon.reset();
});

test("server starts (and reports version)", async t => {
    let { version } = require("../package.json");
    let res = await http().get("/version");

    t.is(res.statusCode, 200);
    t.is(res.text, version);
    t.regex(res.header["content-type"], /text/);
});

test("in memory MongoDB works", async t => {
    let User = require("../models/User.js");

    let bob = new User({
        name: "Bob",
        email: "bob@example.org",
        password: "mynamebob",
        role: "secretary",
        status: "pending",
    });

    // save bob
    await bob.save();

    // retrieve bob
    let bob2 = await User.findOne({ _id: bob._id });
    t.truthy(bob2);
});

test.serial("POST /claims - delivers notifications", async t => {
    let res = await http()
        .post("/claims")
        .set("Cookie", "x-auth=" + bob.tokens[0].token);

    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /json/);

    await sleep(50);

    t.true(fake_sendEmail.callCount > 0);
});

test.serial("POST /upload - generates upload urls", async t => {
    let res = await http()
        .post("/upload")
        .set("Cookie", "x-auth=" + bob.tokens[0].token);

    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /json/);
    t.truthy(res.body.id);
    t.truthy(res.body.url);
    t.true(res.body.url.startsWith("http"));
    t.true(fake_upload.callCount > 0);
});

function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}

function sinonSetup() {
    let fake_sendSMS = sinon.fake.resolves();
    let fake_sendEmail = sinon.fake.resolves();
    let fake_upload = sinon.fake.resolves(
        "http://example.org/CB69642E-A2CB-40EE-B5D0-4EF6FF26012B"
    );
    let stub_getTandaByID = id => Promise.resolve(testTanda);
    let stub_getUserByID = id => Promise.resolve(testUsers[id]);

    sinon.replace(require("../lib/twilio"), "sendSMS", fake_sendSMS);
    sinon.replace(require("../lib/twilio"), "sendEmail", fake_sendEmail);
    sinon.replace(require("../lib/storage"), "createUploadUrl", fake_upload);

    return { fake_sendSMS, fake_sendEmail, fake_upload };
}

async function mongoSetup() {
    let User = mongoose.model("users");
    let Group = mongoose.model("groups");

    alice = new User({
        name: "Alice",
        phone: "15551231234",
        email: "alice@example.org",
        role: "secretary",
        status: "approved",
        settings: [
            { code: "claim_created", domain: "email", value: true },
            { code: "claim_updated", domain: "email", value: true },
            { code: "claim_approved", domain: "sms", value: true },
            { code: "premium_paid", domain: "sms", value: true },
            { code: "example", domain: "sms", value: true },
        ],
    });

    bob = new User({
        name: "Bob",
        phone: "15553214321",
        email: "bob@example.org",
        role: "policyholder",
        status: "approved",
        settings: [
            { code: "claim_approved", domain: "email", value: true },
            { code: "claim_approved", domain: "sms", value: true },
            { code: "example", domain: "email", value: true },
        ],
    });

    await alice.save();
    await bob.save();

    await alice.generateAuthToken();
    await bob.generateAuthToken();

    let tanda = new Group({ members: [alice._id, bob._id] });
    await tanda.save();

    alice.groupID = tanda._id;
    bob.groupID = tanda._id;

    await alice.save();
    await bob.save();
}
