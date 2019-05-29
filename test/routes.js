let test = require("ava");
let request = require("supertest");

let app = require("../lib/routes");
let http = () => request(app);

test("server starts (and reports version)", async t => {
    let { version } = require("../package.json");
    let r = await http().get("/version");

    t.is(r.statusCode, 200);
    t.is(r.text, version);
    t.regex(r.header["content-type"], /text/);
});
