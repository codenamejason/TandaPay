async function setupMongo() {
    let MemoryMongo = require("mongo-in-memory");
    let mongoose = require("mongoose");

    let port = 10000 + Math.floor(50000 * Math.random());
    let mongo = new MemoryMongo(port);

    // ugh, callbacks
    await new Promise((res, rej) =>
        mongo.start(err => (err ? rej(err) : res()))
    );

    let uri = mongo.getMongouri("test");
    mongoose.connect(uri, { useNewUrlParser: true });
}

async function seedMongo() {
    let mongoose = require("mongoose");

    let User = mongoose.model("users");
    let Group = mongoose.model("groups");

    let alice = new User({
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

    let bob = new User({
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

    let group = new Group({
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

    return { alice, bob, group };
}

function setupSinon() {
    // if the server is set up before sinon the fake functions won't be used
    if (isServerSetup)
        throw new Error("setupSinon can't be called after setupServer!");

    let sinon = require("sinon");

    let sendSMS = sinon.fake.resolves();
    let sendEmail = sinon.fake.resolves();
    let upload = sinon.fake.resolves(
        "http://example.org/CB69642E-A2CB-40EE-B5D0-4EF6FF26012B"
    );

    sinon.replace(require("../lib/twilio"), "sendSMS", sendSMS);
    sinon.replace(require("../lib/twilio"), "sendEmail", sendEmail);
    sinon.replace(require("../lib/storage"), "createUploadUrl", upload);

    isSinonSetup = true;

    return { sendSMS, sendEmail, upload };
}

function resetSinon() {
    let sinon = require("sinon");
    sinon.reset();
}

let isServerSetup = false;
function setupServer() {
    isServerSetup = true;
    require("../models/register");
    let request = require("supertest");
    let app = require("../routes");
    return () => request(app);
}

function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}

function setupAll(test) {
    let fake = setupSinon();
    let http = setupServer();
    let data = {}; // access to test objects

    test.before(async t => {
        await setupMongo();
        let seedData = await seedMongo();
        // Obj.assign is used here because we've already returned the object
        Object.assign(data, seedData);
    });

    // NOTE: All tests that check the state of fake_'s need to run in .serial
    // mode so call state can be reset between tests
    test.beforeEach(t => {
        resetSinon();
    });

    test("in memory MongoDB works", async t => {
        let User = require("../models/User.js");

        let eve = new User({
            name: "Eve",
            email: "Eve@example.org",
            password: "mynameeve",
            role: "secretary",
            status: "pending",
        });

        // save eve
        await eve.save();

        // retrieve eve
        let eve2 = await User.findOne({ _id: eve._id });
        t.truthy(eve2);
    });

    return { fake, http, data };
}

module.exports = {
    setupMongo,
    seedMongo,
    setupSinon,
    resetSinon,
    setupServer,
    setupAll,
    sleep,
};
