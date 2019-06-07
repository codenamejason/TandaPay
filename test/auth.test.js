const expect = require("expect");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { app } = require("../index");
const User = require("../models/User");
const cookieParser = require("set-cookie-parser");

test("should pass every time", () => {
	expect(true);
});
suite("POST /signup", () => {
	suite("Policyholder", () => {
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
			expect(errors.role.message).toEqual("Path `role` is required.");
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
					password: "12345",
					role: "policyholder"
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
					password: "1234ilguyfuflyf5",
					role: "policyholder"
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
					password: "12345lhoasfy943",
					role: "policyholder"
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
					password: "12345lhoasfy943",
					role: "policyholder"
				});
			expect(firstResponse.status).toEqual(200);
			expect(firstResponse.body.token).toBeDefined(); //user has been authenticated

			//Invalid request
			const response = await request(app)
				.post("/auth/signup")
				.send({
					name: "Jane Doe",
					email: "jane@gmail.com",
					password: "fasfasefw",
					role: "policyholder"
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
			const role = "policyholder";
			const response = await request(app)
				.post("/auth/signup")
				.send({
					name,
					email,
					password,
					role
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
			expect(body.status).toEqual("approved");
			expect(body.accountCompleted).toEqual(false);
			//makes sure user's token has right values
			const decoded = jwt.decode(body.token);
			expect(decoded.access).toEqual("auth");
			expect(decoded.sub).toBeDefined();
			expect(decoded.role).toEqual("policyholder");

			const user = await User.findOne({ email });
			expect(user).toBeDefined();
			expect(body.token).toEqual(parsedCookie.value);
		});
	});
	suite("Secretary", () => {
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
			expect(errors.role.message).toEqual("Path `role` is required.");
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
					password: "12345",
					role: "secretary"
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
					password: "1234ilguyfuflyf5",
					role: "secretary"
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
					password: "12345lhoasfy943",
					role: "secretary"
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
					password: "12345lhoasfy943",
					role: "secretary"
				});
			expect(firstResponse.status).toEqual(200);
			expect(firstResponse.body.token).toBeDefined(); //user has been authenticated

			//Invalid request
			const response = await request(app)
				.post("/auth/signup")
				.send({
					name: "Jane Doe",
					email: "jane@gmail.com",
					password: "fasfasefw",
					role: "secretary"
				});

			expect(response.status).toEqual(409); // 409 Conflict
			const errors = response.body.errors;
			expect(Object.keys(errors).length).toEqual(1);
			expect(errors.email).toEqual("Email already in use.");
			expect(response.headers["set-cookie"]).toBeUndefined();
		});
		test("Should allow the user to sign up as a secretary, set its status to pending and return a auth token", async () => {
			const password = "12345lhoasfy943";
			const name = "Jane Doe";
			const email = "jane@gmail.com";
			const role = "secretary";
			const response = await request(app)
				.post("/auth/signup")
				.send({
					name,
					email,
					password,
					role
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
			expect(decoded.role).toEqual("secretary");

			const user = await User.findOne({ email });
			expect(user).toBeDefined();
			expect(body.token).toEqual(parsedCookie.value);
			expect(user.role).toEqual("secretary");
			expect(user.status).toEqual("pending");
		});
	});
});

suite("POST /login", () => {
	suite("Policyholder", () => {
		let body = {
			password: "12345lhoasfy943",
			name: "Jane Doe",
			email: "jane@gmail.com",
			role: "policyholder"
		};
		setup(async () => {
			await request(app)
				.post("/auth/signup")
				.send(body);
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
			const response = await request(app)
				.post("/auth/login")
				.send({
					email: body["email"]
				});
			expect(response.status).toBe(400);
			expect(response.headers["set-cookie"]).toBeUndefined();
			expect(response.body.error).toBe(
				"User did not provide all appropriate credentials"
			);
		});
		test("Should not allow the user to login when the email is not provided", async () => {
			const response = await request(app)
				.post("/auth/login")
				.send({
					password: body["password"]
				});
			expect(response.status).toBe(400);
			expect(response.headers["set-cookie"]).toBeUndefined();
			expect(response.body.error).toBe(
				"User did not provide all appropriate credentials"
			);
		});
		test("Should not allow the user to login to a non-existing account", async () => {
			const email = "alexsondres@gmail.com";
			const password = "ohasoiuf09829fg";
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
			const password = ";ajsodfho4hohf3";
			const response = await request(app)
				.post("/auth/login")
				.send({
					email: body["email"],
					password
				});
			expect(response.status).toEqual(409);
			expect(response.body.error).toEqual(
				"User with given credentials not found"
			);
			expect(response.headers["set-cookie"]).toBeUndefined();
		});
		test("Should allow the user to login when the correct credentials are provided", async () => {
			const response = await request(app)
				.post("/auth/login")
				.send({
					email: body["email"],
					password: body["password"]
				});

			const res = response.body;
			const parsedCookie = cookieParser.parse(
				response.headers["set-cookie"][0]
			)[0];
			expect(response.status).toBe(200);
			expect(parsedCookie.value).toEqual(res.token);

			expect(res.email).toEqual(body["email"]);
			expect(res.name).toEqual("Jane Doe");

			const token = res.token;
			expect(token).toBeDefined();

			const decoded = jwt.decode(token);

			expect(decoded.access).toEqual("auth");
			expect(decoded.sub).toBeDefined();
			expect(decoded.role).toEqual(body["role"]);
		});
	});
	suite("Secretary", () => {
		let body = {
			password: "12345lhoasfy943",
			name: "Jane Doe",
			email: "jane@gmail.com",
			role: "secretary"
		};
		setup(async () => {
			await request(app)
				.post("/auth/signup")
				.send(body);
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
			const response = await request(app)
				.post("/auth/login")
				.send({
					email: body["email"]
				});
			expect(response.status).toBe(400);
			expect(response.headers["set-cookie"]).toBeUndefined();
			expect(response.body.error).toBe(
				"User did not provide all appropriate credentials"
			);
		});
		test("Should not allow the user to login when the email is not provided", async () => {
			const response = await request(app)
				.post("/auth/login")
				.send({
					password: body["password"]
				});
			expect(response.status).toBe(400);
			expect(response.headers["set-cookie"]).toBeUndefined();
			expect(response.body.error).toBe(
				"User did not provide all appropriate credentials"
			);
		});
		test("Should not allow the user to login to a non-existing account", async () => {
			const email = "alexsondres@gmail.com";
			const password = "ohasoiuf09829fg";
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
			const password = ";ajsodfho4hohf3";
			const response = await request(app)
				.post("/auth/login")
				.send({
					email: body["email"],
					password
				});
			expect(response.status).toEqual(409);
			expect(response.body.error).toEqual(
				"User with given credentials not found"
			);
			expect(response.headers["set-cookie"]).toBeUndefined();
		});
		test("Should allow the user to login when the correct credentials are provided", async () => {
			const response = await request(app)
				.post("/auth/login")
				.send({
					email: body["email"],
					password: body["password"]
				});

			const res = response.body;
			const parsedCookie = cookieParser.parse(
				response.headers["set-cookie"][0]
			)[0];
			expect(response.status).toBe(200);
			expect(parsedCookie.value).toEqual(res.token);

			expect(res.email).toEqual(body["email"]);
			expect(res.name).toEqual("Jane Doe");

			const token = res.token;
			expect(token).toBeDefined();

			const decoded = jwt.decode(token);

			expect(decoded.access).toEqual("auth");
			expect(decoded.sub).toBeDefined();
			expect(decoded.role).toEqual(body["role"]);
		});
	});
});

suite("GET /user", () => {
	suite("Policyholder", () => {
		let cookie;
		let token;
		setup(async () => {
			const password = "12345lhoasfy943";
			const name = "Jane Doe";
			const email = "jane@gmail.com";
			const role = "policyholder";
			const response = await request(app)
				.post("/auth/signup")
				.send({
					name,
					email,
					password,
					role
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
	suite("Secretary", () => {
		let cookie;
		let token;
		setup(async () => {
			const password = "12345lhoasfy943";
			const name = "Jane Doe";
			const email = "jane@gmail.com";
			const role = "secretary";
			const response = await request(app)
				.post("/auth/signup")
				.send({
					name,
					email,
					password,
					role
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
});

suite("POST /logout", () => {
	let cookie;
	setup(async () => {
		const password = "12345lhoasfy943";
		const name = "Jane Doe";
		const email = "jane@gmail.com";
		const role = "policyholder";
		const response = await request(app)
			.post("/auth/signup")
			.send({
				name,
				email,
				password,
				role
			});
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
