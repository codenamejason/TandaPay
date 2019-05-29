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

// NOTE: All tests that check the state of fake_'s need to run in .serial mode
// so call state can be reset between tests
test.beforeEach(t => {
    sinon.reset();
});

test("notifications can be instantiated", t => {
    t.notThrows(() => new Notification(0));
    t.notThrows(() => new ClaimCreatedNotification(0, 0));
    t.notThrows(() => new ClaimUpdatedNotification(0, 0));
    t.notThrows(() => new ClaimApprovedNotification(0, 0, 1));
    t.notThrows(() => new PremiumPaidNotification(0, 0));
});

test.serial("`Notification`s can be delivered", async t => {
    let notif = new Notification(0);

    await notif.deliver();

    t.is(fake_sendSMS.callCount, 1);
    t.is(fake_sendSMS.getCall(0).args[0], "15551231234");

    t.is(fake_sendEmail.callCount, 1);
    t.is(fake_sendEmail.getCall(0).args[0], "bob@example.org");
});

test.serial("`ClaimCreatedNotification`s work", async t => {
    let notif = new ClaimCreatedNotification(0, 1);

    await notif.deliver();

    t.is(fake_sendSMS.callCount, 0);

    t.is(fake_sendEmail.callCount, 1);
    t.is(fake_sendEmail.getCall(0).args[0], "alice@example.org");
});

function sinonSetup() {
    let testTanda = { members: [0, 1] };
    let testUsers = [
        {
            name: "Alice",
            phone: "15551231234",
            email: "alice@example.org",
            notificationSettings: {
                email: ["claim_created", "claim_updated"],
                sms: ["claim_approved", "premium_paid", "example"],
            },
        },
        {
            name: "Bob",
            phone: "15553214321",
            email: "bob@example.org",
            notificationSettings: {
                email: ["claim_approved", "example"],
                sms: ["claim_approved"],
            },
        },
    ];

    let fake_sendSMS = sinon.fake.resolves();
    let fake_sendEmail = sinon.fake.resolves();

    sinon.replace(require("../lib/db"), "getTandaByID", id => testTanda);
    sinon.replace(require("../lib/db"), "getUserByID", id => testUsers[id]);
    sinon.replace(require("../lib/twilio"), "sendSMS", fake_sendSMS);
    sinon.replace(require("../lib/twilio"), "sendEmail", fake_sendEmail);

    return { fake_sendSMS, fake_sendEmail };
}
