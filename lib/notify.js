const { TWILIO_SID, TWILIO_TOKEN, TWILIO_PHONE } = process.env;

let twilio = new require("twilio")(TWILIO_SID, TWILIO_TOKEN);
let db = require("./db");

module.exports.notify = notify;
async function notify(userid, notification) {
    let user = await db.getUserByID(userid);

    let { email, sms } = shouldNotifyWith(user, notification);

    if (sms) {
        try {
            await sendSMS(user.phone, notification.toString());
        } catch (e) {
            let text = notification.toString().substr(0, 10) + "...";
            console.error(`failed to sendSMS(${user.phone}, ${text})`, e);
        }
    }

    if (email) {
        try {
            await sendEmail(user.email, notification.toString());
        } catch (e) {
            let text = notification.toString().substr(0, 10) + "...";
            console.error(`failed to sendEmail(${user.phone}, ${text})`, e);
        }
    }
}

function shouldNotifyWith(user, notification) {
    let settings = user.notificationSettings;

    let email = settings.email.includes(notification.kind);
    let sms = settings.sms.includes(notification.kind);

    return { email, sms };
}

function sendSMS(phone, text) {
    return twilio.messages.create({
        body: "TandaPay: " + text,
        to: "16308152578",
        from: TWILIO_PHONE,
    });
}

function sendEmail(email, subject, text) {
    throw new Error("sendEmail unimplemented");
}
