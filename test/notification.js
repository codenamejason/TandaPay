let test = require("ava");
let sinon = require("sinon");

let {
    Notification,
    ClaimCreatedNotification,
    ClaimUpdatedNotification,
    ClaimApprovedNotification,
    PremiumPaidNotification,
} = require("../lib/notification");

sinon.replace(require("../lib/twilio"), "sendSMS", sinon.fake.resolves());
sinon.replace(require("../lib/twilio"), "sendEmail", sinon.fake.resolves());

test("notifications can be instantiated", t => {
    t.notThrows(() => new Notification());
    t.notThrows(() => new ClaimCreatedNotification());
    t.notThrows(() => new ClaimUpdatedNotification());
    t.notThrows(() => new ClaimApprovedNotification());
    t.notThrows(() => new PremiumPaidNotification());
});
