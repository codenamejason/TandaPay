const expect = require("expect");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { app } = require("../index");
const User = require("../models/User");
const cookieParser = require("set-cookie-parser");

suite("POST /signup", () => {
  test("should pass every time", () => {
    expect(true);
  });
  test("Should not allow the user to sign up when body is empty", async () => {
    const response = await request(app).post("/auth/signup");

    ///check status
    expect(response.status).toEqual(400);
    const errors = response.body.errors;
    //check number of errors
    expect(Object.keys(errors).length).toEqual(3);

    //check errors
    expect(errors.name.message).toEqual("Path `name` is required.");
    expect(errors.email.message).toEqual("Path `email` is required.");
    expect(errors.password.message).toEqual("Path `password` is required.");

    const users = await User.find();
    expect(users.length).toEqual(0);
    expect(response.header["x-auth"]).toBeUndefined();
  });
  test("Should not allow the user to signup without proper password", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .send({
        name: "Jane Doe",
        email: "janedoe1423@gmail.com",
        password: "12345"
      });

    ///check status
    expect(response.status).toEqual(400);
    const errors = response.body.errors;

    expect(Object.keys(errors).length).toEqual(1); // only the password should be wrong
    expect(errors.password.message).toEqual(
      "Path `password` (`12345`) is shorter than the minimum allowed length (8)."
    );
    expect(response.headers["set-cookie"]).toBeUndefined();
  });

  test("Should not allow the user to signup without a name", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .send({
        email: "janedoe1423@gmail.com",
        password: "1234ilguyfuflyf5"
      });

    ///check status
    expect(response.status).toEqual(400);
    const errors = response.body.errors;

    expect(Object.keys(errors).length).toEqual(1); // only the name should be wrong
    expect(errors.name.message).toEqual("Path `name` is required.");
    expect(response.headers["set-cookie"]).toBeUndefined();
  });

  test("Should not allow the user to sign up without a proper email", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .send({
        name: "Jane Doe",
        email: "@gmail.com",
        password: "12345lhoasfy943"
      });

    ///check status
    expect(response.status).toEqual(400);
    const errors = response.body.errors;

    expect(Object.keys(errors).length).toEqual(1); // only the password should be wrong
    expect(errors.email.message).toEqual("@gmail.com is not a valid email.");
    expect(response.headers["set-cookie"]).toBeUndefined();
  });

  test("Should not allow the user to signup with pre-existing credentials", async () => {
    const firstResponse = await request(app)
      .post("/auth/signup")
      .send({
        name: "Jane Doe",
        email: "jane@gmail.com",
        password: "12345lhoasfy943"
      });

    expect(firstResponse.status).toEqual(200);
    expect(firstResponse.body.token).toBeDefined(); //user has been authenticated

    //Invalid request
    const response = await request(app)
      .post("/auth/signup")
      .send({
        name: "Jane Doe",
        email: "jane@gmail.com",
        password: "fasfasefw"
      });

    expect(response.status).toEqual(409); // 409 Conflict
    const errors = response.body.errors;
    expect(Object.keys(errors).length).toEqual(1);
    expect(errors.email).toEqual("Email already in use.");
    expect(response.headers["set-cookie"]).toBeUndefined();
  });
  test("Should allow the user to signup and should return the auth token", async () => {
    const password = "12345lhoasfy943";
    const name = "Jane Doe";
    const email = "jane@gmail.com";
    const response = await request(app)
      .post("/auth/signup")
      .send({
        name,
        email,
        password
      });
    expect(response.status).toEqual(200);
    //gets body and auth cookie from the response
    const body = response.body;
    const parsedCookie = cookieParser.parse(
      response.headers["set-cookie"][0]
    )[0];

    //expect the right response body
    expect(body.name).toEqual(name);
    expect(body.email).toEqual(email);
    expect(body.token).toEqual(parsedCookie.value); //user has been authenticated

    //makes sure user's token has right values
    const decoded = jwt.decode(body.token);
    expect(decoded.access).toEqual("auth");
    expect(decoded.sub).toBeDefined();
    expect(decoded.accessLevel).toEqual("user");

    const user = await User.findOne({ email });
    expect(user).toBeDefined();
    expect(body.token).toEqual(parsedCookie.value);
  });
});

suite("POST /login", () => {
  setup(async () => {
    const password = "12345lhoasfy943";
    const name = "Jane Doe";
    const email = "jane@gmail.com";
    await request(app)
      .post("/auth/signup")
      .send({
        name,
        email,
        password
      });
  });
  test("Should not allow the user to login when the body is empty", async () => {
    const response = await request(app).post("/auth/login");
    expect(response.status).toBe(400);
    expect(response.headers["set-cookie"]).toBeUndefined();
    expect(response.body.error).toBe(
      "User did not provide all appropriate credentials"
    );
  });
  test("Should not allow the user to login when the password is not provided", async () => {
    const email = "jane@gmail.com";
    const response = await request(app)
      .post("/auth/login")
      .send({
        email
      });
    expect(response.status).toBe(400);
    expect(response.headers["set-cookie"]).toBeUndefined();
    expect(response.body.error).toBe(
      "User did not provide all appropriate credentials"
    );
  });
  test("Should not allow the user to login when the email is not provided", async () => {
    const password = "12345lhoasfy943";
    const response = await request(app)
      .post("/auth/login")
      .send({
        password
      });
    expect(response.status).toBe(400);
    expect(response.headers["set-cookie"]).toBeUndefined();
    expect(response.body.error).toBe(
      "User did not provide all appropriate credentials"
    );
  });
  test("Should not allow the user to login to a non-existing account", async () => {
    const password = "fasfrrw4r3fa";
    const email = "joy@gmail.com";
    const response = await request(app)
      .post("/auth/login")
      .send({
        email,
        password
      });
    expect(response.status).toEqual(409);
    const error = response.body.error;
    expect(error).toEqual("User with given credentials not found");
    expect(response.headers["set-cookie"]).toBeUndefined();
  });
  test("Should not allow the user to login with a incorrect password", async () => {
    const email = "jane@gmail.com";
    const password = "389ha9sfha9s8rfh3";
    const response = await request(app)
      .post("/auth/login")
      .send({
        email,
        password
      });
    expect(response.status).toEqual(409);
    expect(response.body.error).toEqual(
      "User with given credentials not found"
    );
    expect(response.headers["set-cookie"]).toBeUndefined();
  });
  test("Should allow the user to login when the correct credentials are provided", async () => {
    const password = "12345lhoasfy943";
    const email = "jane@gmail.com";
    const response = await request(app)
      .post("/auth/login")
      .send({
        email,
        password
      });

    const body = response.body;
    const parsedCookie = cookieParser.parse(
      response.headers["set-cookie"][0]
    )[0];
    expect(response.status).toBe(200);
    expect(parsedCookie.value).toEqual(body.token);

    expect(body.email).toEqual(email);
    expect(body.name).toEqual("Jane Doe");

    const token = body.token;
    expect(token).toBeDefined();

    const decoded = jwt.decode(token);
    expect(decoded.access).toEqual("auth");
    expect(decoded.sub).toBeDefined();
    expect(decoded.accessLevel).toEqual("user");
  });
});

suite("GET /user", () => {
  let cookie;
  let token;
  setup(async () => {
    const password = "12345lhoasfy943";
    const name = "Jane Doe";
    const email = "jane@gmail.com";
    const response = await request(app)
      .post("/auth/signup")
      .send({
        name,
        email,
        password
      });

    cookie = response.headers["set-cookie"][0];
    token = response.body.token;
  });

  test("Should not allow a user without authentication to get their user profile", async () => {
    const response = await request(app).get("/auth/user");
    expect(response.status).toEqual(401);
    expect(response.body.error).toEqual("User must be logged in");
  });
  test("Should return the user's profile when properly authenticated", async () => {
    const response = await request(app)
      .get("/auth/user")
      .set("Cookie", cookie);

    expect(response.status).toEqual(200);
    expect(response.body.tokens[0].token).toEqual(token);
    expect(response.body.tokens[0].access).toEqual("auth");
  });
});

suite("POST /logout", () => {
  let token;
  let cookie;
  setup(async () => {
    const password = "12345lhoasfy943";
    const name = "Jane Doe";
    const email = "jane@gmail.com";
    const response = await request(app)
      .post("/auth/signup")
      .send({
        name,
        email,
        password
      });

    token = response.body.token;
    cookie = response.headers["set-cookie"][0];
  });
  test("Should not log out a user with no token", async () => {
    const response = await request(app).post("/auth/logout");
    expect(response.status).toEqual(401);
    expect(response.body.error).toEqual("User must be logged in");
  });
  test("Should not log out a user with a invalid token", async () => {
    const response = await request(app)
      .post("/auth/logout")
      .set("Cookie", "x-auth=ajfohf09324yt83haofjasn89h389fh");
    expect(response.status).toEqual(401);
    expect(response.body.error).toEqual(
      "Invalid credentials provided. Acquire new credentials."
    );
  });
  test("Should log out the user when provided a valid token", async () => {
    const response = await request(app)
      .post("/auth/logout")
      .set("Cookie", cookie);

    expect(response.status).toEqual(200);
    expect(response.body.success).toEqual(
      "You have been logged out successfully"
    );
  });
});
teardown("Tearing down tests", async () => {
  await User.deleteMany({});
});
