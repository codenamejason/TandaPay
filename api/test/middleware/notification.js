let test = require("ava");
let sinon = require("sinon");
let {
    setupMongo,
    seedMongo,
    setupSinon,
    resetSinon,
    sleep,
} = require("../common");

let fake = setupSinon();

require("../../models/register");
let {
    Notification,
    ClaimCreatedNotification,
    ClaimUpdatedNotification,
    ClaimApprovedNotification,
    PremiumPaidNotification,
} = require("../../lib/notification");
let createSendNofificationMiddleware = require("../../middleware/notification");

let data;
test.before(async t => {
    await setupMongo();
    data = await seedMongo();
});

test.beforeEach(t => {
    resetSinon();
});

test("notifications can be instantiated", t => {
    t.notThrows(() => {
        new Notification({ groupID: data.group._id });
    });
    t.notThrows(() => {
        new ClaimCreatedNotification({
            groupID: data.group._id,
            claimantID: data.bob._id,
        });
    });
    t.notThrows(() => {
        new ClaimUpdatedNotification({
            groupID: data.group._id,
            claimantID: data.bob._id,
        });
    });
    t.notThrows(() => {
        new ClaimApprovedNotification({
            groupID: data.group._id,
            claimantID: data.bob._id,
            approverID: data.alice._id,
        });
    });
    t.notThrows(() => {
        new PremiumPaidNotification({
            groupID: data.group._id,
            payerID: data.bob._id,
        });
    });
});

test.serial("`Notification`s can be delivered", async t => {
    let notif = new Notification({ groupID: data.group._id });

    await notif.deliver();

    t.is(fake.sendSMS.callCount, 1);
    t.is(fake.sendSMS.getCall(0).args[0], "15551231234");

    t.is(fake.sendEmail.callCount, 1);
    t.is(fake.sendEmail.getCall(0).args[0], "bob@example.org");
});

test.serial("`ClaimCreatedNotification`s work", async t => {
    let notif = new ClaimCreatedNotification({
        groupID: data.group._id,
        claimantID: data.bob._id,
    });

    await notif.deliver();

    t.is(fake.sendSMS.callCount, 0);

    t.is(fake.sendEmail.callCount, 1);
    t.is(fake.sendEmail.getCall(0).args[0], "alice@example.org");
    t.regex(fake.sendEmail.getCall(0).args[2], /claim created/i);
});

test.serial("`ClaimUpdatedNotification`s work", async t => {
    let notif = new ClaimUpdatedNotification({
        groupID: data.group._id,
        claimantID: data.bob._id,
    });

    await notif.deliver();

    t.is(fake.sendSMS.callCount, 0);

    t.is(fake.sendEmail.callCount, 1);
    t.is(fake.sendEmail.getCall(0).args[0], "alice@example.org");
    t.regex(fake.sendEmail.getCall(0).args[2], /claim updated/i);
});

test.serial("`ClaimApprovedNotification`s work", async t => {
    let notif = new ClaimApprovedNotification({
        groupID: data.group._id,
        claimantID: data.bob._id,
        approverID: data.alice._id,
    });

    await notif.deliver();

    t.is(fake.sendSMS.callCount, 2);
    t.is(fake.sendSMS.getCall(0).args[0], "15551231234");
    t.is(fake.sendSMS.getCall(1).args[0], "15553214321");
    t.regex(fake.sendSMS.getCall(0).args[1], /claim approved/i);
    t.regex(fake.sendSMS.getCall(1).args[1], /claim approved/i);

    t.is(fake.sendEmail.callCount, 1);
    t.is(fake.sendEmail.getCall(0).args[0], "bob@example.org");
    t.regex(fake.sendEmail.getCall(0).args[2], /claim approved/i);
});

test.serial("`PremiumPaidNotification`s work", async t => {
    let notif = new PremiumPaidNotification({
        groupID: data.group._id,
        payerID: data.bob._id,
    });

    await notif.deliver();

    t.is(fake.sendSMS.callCount, 1);
    t.is(fake.sendSMS.getCall(0).args[0], "15551231234");
    t.regex(fake.sendSMS.getCall(0).args[1], /premium/i);

    t.is(fake.sendEmail.callCount, 0);
});

test.serial("notification middleware delivers notifications", async t => {
    let claimApprovedMiddleware = createSendNofificationMiddleware(
        "claim_approved"
    );
    let fakeNext = sinon.fake.returns();

    claimApprovedMiddleware(
        {
            groupID: data.group._id,
            claimantID: data.bob._id,
            approverID: data.alice._id,
        },
        {},
        fakeNext
    );

    // terrible horrible no good very bad hack. middleware intentionally doesn't
    // wait for notifications to be delivered, so from here we have no way of
    // knowing when delivery is done. sleep 540ms before checking status
    await sleep(450);

    // middleware should call next()
    t.is(fakeNext.callCount, 1);

    // middleware should call sendSMS and sendEmail
    t.true(fake.sendSMS.callCount > 0);
    t.true(fake.sendEmail.callCount > 0);

    // check that the it sends the right kind of notification
    t.regex(fake.sendSMS.getCall(0).args[1], /claim approved/i);
});

test.serial("email notifications use html email", async t => {
    let notif = new Notification({ groupID: data.group._id });
    await notif.deliver();
    t.regex(fake.sendEmail.getCall(0).args[2], /html/);
});
