const { TWILIO_SID, TWILIO_TOKEN, TWILIO_PHONE } = process.env;

// twilio is lazily instantiated to give the test suite time to mock it out
let twilio = null;
function setup() {
    twilio = new require("twilio")(TWILIO_SID, TWILIO_TOKEN);
}

function sendSMS(phone, text) {
    if (twilio == null) setup();
    try {
        return twilio.messages.create({
            body: "TandaPay: " + text,
            to: "16308152578",
            from: TWILIO_PHONE,
        });
    } catch (e) {
        let text = notification.toString().substr(0, 16) + "...";
        console.error(`failed to sendSMS(${user.phone}, ${text})`, e);
    }
}

function sendEmail(email, subject, text) {
    if (twilio == null) setup();
    try {
        throw new Error("sendEmail unimplemented");
    } catch (e) {
        let text = notification.toString().substr(0, 16) + "...";
        console.error(`failed to sendEmail(${user.phone}, ${text})`, e);
    }
}

module.exports = { sendEmail, sendSMS };
