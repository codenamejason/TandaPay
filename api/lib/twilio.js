const {
    twilioSid,
    twilioToken,
    twilioPhone,
    sendgridKey,
} = require("../config/keys");

// twilio is lazily instantiated to give the test suite time to mock it out
let twilio = null;
let sendgrid = null;

/**
 * @summary: Sets up third party libs for notification delivery
 * @returns: void
 */
function setup() {
    twilio = new require("twilio")(twilioSid, twilioToken);
    sendgrid = require("@sendgrid/mail");
    sendgrid.setApiKey(sendgridKey);
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
            to: phone,
            from: twilioPhone,
        });
    } catch (e) {
        text = text.toString().substr(0, 16) + "...";
        console.error(`failed to sendSMS(${user.phone}, ${text})`, e);
    }
}

/**
 * @summary: Sends an Email using SendGrid
 * @param email: The email address to send the message to
 * @param subject: The subject line of the email
 * @param html: The body html of the message
 * @returns: void
 */
function sendEmail(email, subject, html) {
    console.log("Here");

    if (sendgrid == null) setup();
    try {
        return sendgrid.send({
            to: email,
            from: "noreply@tandapay.com",
            subject,
            html,
        });
    } catch (e) {
        html = text.toString().substr(0, 16) + "...";
        console.error(`failed to sendEmail(${user.phone}, ${html})`, e);
    }
}

function sendEmailMulti(email, subject, html) {
    console.log("Here");

    if (sendgrid == null) setup();
    try {
        return sendgrid.sendMultiple({
            to: email,
            from: "noreply@tandapay.com",
            subject,
            html,
        });
    } catch (e) {
        html = text.toString().substr(0, 16) + "...";
        console.error(`failed to sendEmail(${user.phone}, ${html})`, e);
    }
}

module.exports = { sendEmail, sendSMS, sendEmailMulti };
