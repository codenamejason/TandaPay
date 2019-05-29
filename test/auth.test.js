const expect = require("expect");
const request = require("supertest");

const { app } = require("../index");
const User = require("../models/User");

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
    expect(response.header["x-auth"]).toBeUndefined();
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
    expect(response.header["x-auth"]).toBeUndefined();
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
    expect(response.header["x-auth"]).toBeUndefined();
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
    expect(firstResponse.body.tokens.length).toEqual(1); //user has been authenticated

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
    expect(response.header["x-auth"]).toBeUndefined();
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
    const body = response.body;
    //expect the right response body
    expect(body.name).toEqual(name);
    expect(body.email).toEqual(email);
    expect(body.password).not.toEqual();
    expect(body.tokens.length).toEqual(1); //user has been authenticated

    const token = body.tokens[0];
    expect(token.access).toEqual("auth");
    expect(token._id).toBeDefined();
    expect(token.token).toBeDefined();

    const user = await User.findOne({ email });
    expect(user).toBeDefined();
    expect(user.password).toEqual(body.password);
    expect(user.tokens[0].token).toEqual(token.token);
    expect(response.header["x-auth"]).toBeDefined();
    expect(token.token).toEqual(response.header["x-auth"]);
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
    expect(response.header["x-auth"]).toBeUndefined();
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
    expect(response.header["x-auth"]).toBeUndefined();
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
    expect(response.header["x-auth"]).toBeUndefined();
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
    expect(response.status).toEqual(400);
    const error = response.body.error;
    expect(error).toEqual("User with given credentials not found");
    expect(response.header["x-auth"]).toBeUndefined();
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
    expect(response.status).toEqual(400);
    expect(response.body.error).toEqual(
      "User with given credentials not found"
    );
    expect(response.header["x-auth"]).toBeUndefined();
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

    expect(response.status).toBe(200);
    expect(response.header["x-auth"]).toBeDefined();

    expect(response.body.email).toEqual(email);
    expect(response.body.name).toEqual("Jane Doe");

    const token = response.body.tokens[1];
    expect(token.access).toEqual("auth");
    expect(token.token).toBeDefined();
    expect(token.token).toEqual(response.header["x-auth"]);
  });
});

teardown("Tearing down tests", async () => {
  await User.deleteMany({});
});
