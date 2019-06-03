let test = require("ava");
let sinon = require("sinon");

let { fake_sendSMS, fake_sendEmail } = sinonSetup();

let {
    Notification,
    ClaimCreatedNotification,
    ClaimUpdatedNotification,
    ClaimApprovedNotification,
    PremiumPaidNotification,
} = require("../lib/notification");

let sendNotificationsController = require("../middleware/notification");

// NOTE: All tests that check the state of fake_'s need to run in .serial mode
// so call state can be reset between tests
test.beforeEach(t => {
    sinon.reset();
});

test("notifications can be instantiated", t => {
    t.notThrows(() => {
        new Notification({ tandaID: 0 });
    });
    t.notThrows(() => {
        new ClaimCreatedNotification({ tandaID: 0, claimantID: 0 });
    });
    t.notThrows(() => {
        new ClaimUpdatedNotification({ tandaID: 0, claimantID: 0 });
    });
    t.notThrows(() => {
        new ClaimApprovedNotification({
            tandaID: 0,
            claimantID: 0,
            approverID: 1,
        });
    });
    t.notThrows(() => {
        new PremiumPaidNotification({ tandaID: 0, payerID: 0 });
    });
});

test.serial("`Notification`s can be delivered", async t => {
    let notif = new Notification({ tandaID: 0 });

    await notif.deliver();

    t.is(fake_sendSMS.callCount, 1);
    t.is(fake_sendSMS.getCall(0).args[0], "15551231234");

    t.is(fake_sendEmail.callCount, 1);
    t.is(fake_sendEmail.getCall(0).args[0], "bob@example.org");
});

test.serial("`ClaimCreatedNotification`s work", async t => {
    let notif = new ClaimCreatedNotification({ tandaID: 0, claimantID: 0 });

    await notif.deliver();

    t.is(fake_sendSMS.callCount, 0);

    t.is(fake_sendEmail.callCount, 1);
    t.is(fake_sendEmail.getCall(0).args[0], "alice@example.org");
    t.regex(fake_sendEmail.getCall(0).args[2], /claim created/i);
});

test.serial("`ClaimUpdatedNotification`s work", async t => {
    let notif = new ClaimUpdatedNotification({ tandaID: 0, claimantID: 0 });

    await notif.deliver();

    t.is(fake_sendSMS.callCount, 0);

    t.is(fake_sendEmail.callCount, 1);
    t.is(fake_sendEmail.getCall(0).args[0], "alice@example.org");
    t.regex(fake_sendEmail.getCall(0).args[2], /claim updated/i);
});

test.serial("`ClaimApprovedNotification`s work", async t => {
    let notif = new ClaimApprovedNotification({
        tandaID: 0,
        claimantID: 0,
        approverID: 1,
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
    let notif = new PremiumPaidNotification({ tandaID: 0, payerID: 0 });

    await notif.deliver();

    t.is(fake_sendSMS.callCount, 1);
    t.is(fake_sendSMS.getCall(0).args[0], "15551231234");
    t.regex(fake_sendSMS.getCall(0).args[1], /premium/i);

    t.is(fake_sendEmail.callCount, 0);
});

test.serial("notification middleware delivers notifications", async t => {
    let fake_next = sinon.fake.returns();

    sendNotificationsController(
        {
            notificationKind: "claim_approved",
            tandaID: 0,
            claimantID: 0,
            approverID: 0,
        },
        {},
        fake_next
    );

    // terrible horrible no good very bad hack. middleware intentionally doesn't
    // wait for notifications to be delivered, so from here we have no way of
    // knowing when delivery is done. so wait 100ms before checking status
    await new Promise(res => setTimeout(res), 100);

    // middleware should call next()
    t.is(fake_next.callCount, 1);

    // middleware should call sendSMS and sendEmail
    t.true(fake_sendSMS.callCount > 0);
    t.true(fake_sendEmail.callCount > 0);

    // check that the it sends the right kind of notification
    t.regex(fake_sendSMS.getCall(0).args[1], /claim approved/i);
});

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
    let stub_getTandaByID = id => Promise.resolve(testTanda);
    let stub_getUserByID = id => Promise.resolve(testUsers[id]);

    sinon.replace(require("../lib/db"), "getTandaByID", stub_getTandaByID);
    sinon.replace(require("../lib/db"), "getUserByID", stub_getUserByID);
    sinon.replace(require("../lib/twilio"), "sendSMS", fake_sendSMS);
    sinon.replace(require("../lib/twilio"), "sendEmail", fake_sendEmail);

    return { fake_sendSMS, fake_sendEmail };
}
