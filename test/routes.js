let test = require("ava");
let sinon = require("sinon");
let request = require("supertest");
let mongoose = require("mongoose");
let MemoryMongo = require("mongo-in-memory");

// set up sinon mocks before local requires
let { fake_sendSMS, fake_sendEmail, fake_upload } = sinonSetup();
let alice, bob, group;

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

// skip until claims code actually works
test.skip("POST /claims - delivers notifications", async t => {
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

test.serial("GET /groups/:id - gets a group by ID", async t => {
    let res = await http()
        .get("/groups/" + group._id)
        .set("Cookie", "x-auth=" + bob.tokens[0].token);

    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /json/);
    t.truthy(res.body.secretary);
    t.truthy(res.body.members);
});

test.serial("POST /groups/new - creates a new group", async t => {
    let res = await http()
        .post("/groups/new")
        .set("Cookie", "x-auth=" + alice.tokens[0].token)
        .send({ groupName: "test group", premium: "20.00" });

    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /json/);
    t.truthy(res.body._id);
    t.truthy(res.body.secretary);
    t.truthy(res.body.members);

    let Group = require("../models/Group");
    t.truthy(await Group.findById(res.body._id));
});

test.serial("POST /groups/:id/invite - sends invitation to group", async t => {
    let res = await http()
        .post(`/groups/${group._id}/invite`)
        .set("Cookie", "x-auth=" + alice.tokens[0].token)
        .send({ email: "claire@example.org" });

    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /json/);
    t.true(fake_sendEmail.callCount > 0);
    t.regex(fake_sendEmail.getCall(0).args[2], /test-access-code/);
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

    group = new Group({
        secretary: {
            name: alice.name,
            email: alice.email,
            phone: alice.phone,
        },
        members: [
            {
                id: alice._id,
                name: alice.name,
                profile: "thiswasneverdocumented",
                standing: "good",
            },
            {
                id: bob._id,
                name: bob.name,
                profile: "thiswasneverdocumented",
                standing: "good",
            },
        ],
        groupName: "sally",
        premium: "20.00",
        groupDocs: [],
        groupStanding: "good",
        subgrouos: [],
        accessCode: "test-access-code",
    });

    await group.save();

    alice.groupID = group._id;
    bob.groupID = group._id;

    await alice.save();
    await bob.save();
}
