let test = require("ava");
let sinon = require("sinon");
let mongoose = require("mongoose");
let MemoryMongo = require("mongo-in-memory");

let { fake_sendSMS, fake_sendEmail } = sinonSetup();

require("../models/register");

let {
    Notification,
    ClaimCreatedNotification,
    ClaimUpdatedNotification,
    ClaimApprovedNotification,
    PremiumPaidNotification,
} = require("../lib/notification");

let createSendNofificationMiddleware = require("../middleware/notification");

let groupID, aliceID, bobID;

// set up in memory MongoDB before tests run
test.before(async t => {
    let mongo = new MemoryMongo(1337);

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

test("notifications can be instantiated", t => {
    t.notThrows(() => {
        new Notification({ groupID });
    });
    t.notThrows(() => {
        new ClaimCreatedNotification({ groupID, claimantID: bobID });
    });
    t.notThrows(() => {
        new ClaimUpdatedNotification({ groupID, claimantID: bobID });
    });
    t.notThrows(() => {
        new ClaimApprovedNotification({
            groupID,
            claimantID: bobID,
            approverID: aliceID,
        });
    });
    t.notThrows(() => {
        new PremiumPaidNotification({ groupID, payerID: bobID });
    });
});

test.serial("`Notification`s can be delivered", async t => {
    let notif = new Notification({ groupID });

    await notif.deliver();

    t.is(fake_sendSMS.callCount, 1);
    t.is(fake_sendSMS.getCall(0).args[0], "15551231234");

    t.is(fake_sendEmail.callCount, 1);
    t.is(fake_sendEmail.getCall(0).args[0], "bob@example.org");
});

test.serial("`ClaimCreatedNotification`s work", async t => {
    let notif = new ClaimCreatedNotification({ groupID, claimantID: bobID });

    await notif.deliver();

    t.is(fake_sendSMS.callCount, 0);

    t.is(fake_sendEmail.callCount, 1);
    t.is(fake_sendEmail.getCall(0).args[0], "alice@example.org");
    t.regex(fake_sendEmail.getCall(0).args[2], /claim created/i);
});

test.serial("`ClaimUpdatedNotification`s work", async t => {
    let notif = new ClaimUpdatedNotification({ groupID, claimantID: bobID });

    await notif.deliver();

    t.is(fake_sendSMS.callCount, 0);

    t.is(fake_sendEmail.callCount, 1);
    t.is(fake_sendEmail.getCall(0).args[0], "alice@example.org");
    t.regex(fake_sendEmail.getCall(0).args[2], /claim updated/i);
});

test.serial("`ClaimApprovedNotification`s work", async t => {
    let notif = new ClaimApprovedNotification({
        groupID,
        claimantID: bobID,
        approverID: aliceID,
    });

    await notif.deliver();

    t.is(fake_sendSMS.callCount, 2);
    t.is(fake_sendSMS.getCall(0).args[0], "15551231234");
    t.is(fake_sendSMS.getCall(1).args[0], "15553214321");
    t.regex(fake_sendSMS.getCall(0).args[1], /claim approved/i);
    t.regex(fake_sendSMS.getCall(1).args[1], /claim approved/i);

    t.is(fake_sendEmail.callCount, 1);
    t.is(fake_sendEmail.getCall(0).args[0], "bob@example.org");
    t.regex(fake_sendEmail.getCall(0).args[2], /claim approved/i);
});

test.serial("`PremiumPaidNotification`s work", async t => {
    let notif = new PremiumPaidNotification({ groupID, payerID: bobID });

    await notif.deliver();

    t.is(fake_sendSMS.callCount, 1);
    t.is(fake_sendSMS.getCall(0).args[0], "15551231234");
    t.regex(fake_sendSMS.getCall(0).args[1], /premium/i);

    t.is(fake_sendEmail.callCount, 0);
});

test.serial("notification middleware delivers notifications", async t => {
    let claimApprovedMiddleware = createSendNofificationMiddleware(
        "claim_approved"
    );
    let fake_next = sinon.fake.returns();

    claimApprovedMiddleware(
        {
            groupID,
            claimantID: bobID,
            approverID: aliceID,
        },
        {},
        fake_next
    );

    // terrible horrible no good very bad hack. middleware intentionally doesn't
    // wait for notifications to be delivered, so from here we have no way of
    // knowing when delivery is done.  sleep 100ms before checking status
    await new Promise(res => setTimeout(res, 100));

    // middleware should call next()
    t.is(fake_next.callCount, 1);

    // middleware should call sendSMS and sendEmail
    t.true(fake_sendSMS.callCount > 0);
    t.true(fake_sendEmail.callCount > 0);

    // check that the it sends the right kind of notification
    t.regex(fake_sendSMS.getCall(0).args[1], /claim approved/i);
});

function sinonSetup() {
    let fake_sendSMS = sinon.fake.resolves();
    let fake_sendEmail = sinon.fake.resolves();
    let stub_getTandaByID = id => Promise.resolve(testTanda);
    let stub_getUserByID = id => Promise.resolve(testUsers[id]);

    sinon.replace(require("../lib/twilio"), "sendSMS", fake_sendSMS);
    sinon.replace(require("../lib/twilio"), "sendEmail", fake_sendEmail);

    return { fake_sendSMS, fake_sendEmail };
}

async function mongoSetup() {
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

    let tanda = new Group({ members: [alice._id, bob._id] });

    await tanda.save();

    alice.groupID = tanda._id;
    bob.groupID = tanda._id;

    await alice.save();
    await bob.save();

    aliceID = alice._id;
    bobID = bob._id;
    groupID = tanda._id;
}
