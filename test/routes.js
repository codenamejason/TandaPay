let test = require("ava");
let sinon = require("sinon");
let request = require("supertest");

let { fake_sendSMS, fake_sendEmail } = sinonSetup();

let app = require("../routes");
let http = () => request(app);

// NOTE: All tests that check the state of fake_'s need to run in .serial mode
// so call state can be reset between tests
test.beforeEach(t => {
    sinon.reset();
});

test("server starts (and reports version)", async t => {
    let { version } = require("../package.json");
    let res = await http().get("/version");

    t.is(res.statusCode, 200);
    t.is(res.text, version);
    t.regex(res.header["content-type"], /text/);
});

test("POST /claims - delivers notifications", async t => {
    let res = await http().post("/claims?userID=0&tandaID=0");

    t.is(res.statusCode, 200);
    t.regex(res.header["content-type"], /json/);

    await sleep(50);

    t.true(fake_sendEmail.callCount > 0);
});

function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}

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
