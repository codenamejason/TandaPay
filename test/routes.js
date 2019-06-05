let test = require("ava");
let sinon = require("sinon");
let request = require("supertest");
let MemoryMongo = require("mongo-in-memory");

// set up sinon mocks before local requires
let { fake_sendSMS, fake_sendEmail, fake_upload } = sinonSetup();

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
    require("mongoose").connect(uri, { useNewUrlParser: true });
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

// Skip this test until db is mocked out to allow route to check authentication
test.skip("POST /claims - delivers notifications", async t => {
    let res = await http().post("/claims?userID=0&tandaID=0");

    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /json/);

    await sleep(50);

    t.true(fake_sendEmail.callCount > 0);
});

test.serial("POST /upload - generates upload urls", async t => {
    let res = await http().post("/upload");

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
    let testTanda = { members: [0, 1] };
    let testUsers = [
        {
            name: "Alice",
            phone: "15551231234",
            email: "alice@example.org",
            settings: [
                { code: "claim_created", domain: "email" },
                { code: "claim_updated", domain: "email" },
                { code: "claim_approved", domain: "sms" },
                { code: "premium_paid", domain: "sms" },
                { code: "example", domain: "sms" },
            ],
        },
        {
            name: "Bob",
            phone: "15553214321",
            email: "bob@example.org",
            settings: [
                { code: "claim_approved", domain: "email" },
                { code: "claim_approved", domain: "sms" },
                { code: "example", domain: "email" },
            ],
        },
    ];

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
