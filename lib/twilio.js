const { TWILIO_SID, TWILIO_TOKEN, TWILIO_PHONE, SENDGRID_KEY } = process.env;

// twilio is lazily instantiated to give the test suite time to mock it out
let twilio = null;
let sendgrid = null;

/**
 * @summary: Sets up third party libs for notification delivery
 * @returns: void
 */
function setup() {
    twilio = new require("twilio")(TWILIO_SID, TWILIO_TOKEN);
    sendgrid = require("@sendgrid/mail");
    sendgrid.setApiKey(SENDGRID_KEY);
}

/**
 * @summary: Sends an SMS using Twilio
 * @param phone: The phone number to send a message to
 * @param text: The text to send that phone number
 * @returns: void
 */
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

/**
 * @summary: Sends an Email using SendGrid
 * @param email: The email address to send the message to
 * @param subject: The subject line of the email
 * @param text: The body text of the message
 * @returns: void
 */
function sendEmail(email, subject, text) {
    if (sendgrid == null) setup();
    try {
        return sendgrid.send({
            to: email,
            from: "noreply@tandapay.com",
            subject,
            text,
        });
    } catch (e) {
        let text = notification.toString().substr(0, 16) + "...";
        console.error(`failed to sendEmail(${user.phone}, ${text})`, e);
    }
}

module.exports = { sendEmail, sendSMS };
