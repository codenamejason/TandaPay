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

    expect(response.status).toEqual(403);
    const errors = response.body.errors;
    expect(Object.keys(errors).length).toEqual(1);
    expect(errors.email).toEqual("Email already in use.");
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
  });
});

suite("POST /login", async () => {
  test("Should not allow the user to login to a non-existing account", async () => {});
});
teardown("Tearing down tests", async () => {
  await User.deleteMany({});
});
