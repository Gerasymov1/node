import sinon from "sinon";
import { restoreSandbox, setupSandbox } from "../../heplers/testHelpers.ts";
import { login, register } from "../authControllers.ts";
import { expect } from "chai";
import bcrypt from "bcryptjs";

describe("login", () => {
  let req: any;
  let res: any;
  let sandbox: sinon.SinonSandbox;
  let connectionExecuteStub: sinon.SinonStub;
  let connectionQueryStub: sinon.SinonStub;
  let bcryptStub: sinon.SinonStub;
  let generateTokensStub: sinon.SinonStub;

  beforeEach(() => {
    const setup = setupSandbox({
      body: { password: "password", email: "email" },
    });
    req = setup.req;
    res = setup.res;
    sandbox = setup.sandbox;
    connectionExecuteStub = setup.connectionExecuteStub;
    connectionQueryStub = setup.connectionQueryStub;
    bcryptStub = sandbox.stub(bcrypt, "compare");
    generateTokensStub = sandbox.stub();
  });

  afterEach(() => {
    restoreSandbox(sandbox);
  });

  it("should return bad request if password or email is not provided", async () => {
    req.body = { password: "", email: "" };

    await login(req, res);

    expect(res.badRequest.calledOnce).to.be.true;
    expect(res.badRequest.calledWith("Invalid request, fill in all fields")).to
      .be.true;
  });

  it("should return not found if user not found", async () => {
    connectionExecuteStub.returns([[]]);
    await login(req, res);

    expect(res.notFound.calledOnce).to.be.true;
    expect(res.notFound.calledWith("User not found")).to.be.true;
  });

  it("should return unauthorized if password is invalid", async () => {
    connectionQueryStub.returns([[{ password: "password" }]]);
    bcryptStub.returns(false);

    await login(req, res);

    expect(res.unauthorized.calledOnce).to.be.true;
    expect(res.unauthorized.calledWith("Invalid password or email")).to.be.true;
  });

  it("should return internal server error if refresh token generation fails", async () => {
    const mockedUser = {
      password: "hashed_password",
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
    };

    req.body.password = "hashed_password";
    req.body.email = "john.doe@example.com";

    connectionQueryStub.onCall(0).resolves([[mockedUser]]);
    bcryptStub.onCall(0).resolves(true);
    generateTokensStub.onCall(0).resolves({
      accessToken: null,
      refreshToken: null,
    });
    connectionExecuteStub.onCall(0).resolves([[]]);
    connectionQueryStub.onCall(1).resolves([[]]);

    await login(req, res);

    expect(res.internalServerError.calledOnce).to.be.true;
    expect(res.internalServerError.firstCall.args[0]).to.equal(
      "Error setting refresh token"
    );
  });

  it("should return success if login is successful", async () => {
    const mockedUser = {
      password: "password",
      email: "email",
      firstName: "John",
      lastName: "Doe",
      id: 123,
    };

    connectionQueryStub.onCall(0).resolves([[mockedUser]]);
    bcryptStub.onCall(0).resolves(true);
    connectionExecuteStub.onCall(0).resolves([[mockedUser]]);
    connectionQueryStub.onCall(1).resolves([[mockedUser]]);

    await login(req, res);

    expect(res.success.called).to.be.true;
    expect(res.success.args).to.deep.equal([
      [
        {
          user: {
            firstName: "John",
            lastName: "Doe",
            email: "email",
          },
        },
        "Logged in",
      ],
    ]);
  });
});

describe("register", () => {
  let req: any;
  let res: any;
  let sandbox: sinon.SinonSandbox;
  let connectionQueryStub: sinon.SinonStub;
  let bcryptStub: sinon.SinonStub;

  beforeEach(() => {
    const setup = setupSandbox({
      body: {
        password: "password",
        email: "email",
        firstName: "John",
        lastName: "Doe",
      },
    });
    req = setup.req;
    res = setup.res;
    sandbox = setup.sandbox;
    connectionQueryStub = setup.connectionQueryStub;
    bcryptStub = sandbox.stub(bcrypt, "compare");
  });

  afterEach(() => {
    restoreSandbox(sandbox);
  });

  it('should return bad request if "firstName", "lastName", "password" or "email" is not provided', async () => {
    req.body = { password: "", email: "", firstName: "", lastName: "" };

    await register(req, res);

    expect(res.badRequest.calledOnce).to.be.true;
    expect(res.badRequest.calledWith("Invalid request, fill in all fields")).to
      .be.true;
  });

  it("should return internal server error if user creation fails", async () => {
    connectionQueryStub.throws(new Error("Error creating user"));
    await register(req, res);

    expect(res.internalServerError.calledOnce).to.be.true;
    expect(res.internalServerError.calledWith("Error creating user")).to.be
      .true;
  });

  it("should return success if user is created", async () => {
    const mockedUser = {
      password: "hashed_password",
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
    };

    connectionQueryStub.onCall(0).resolves([[]]);
    bcryptStub.onCall(0).resolves("hashed_password");
    connectionQueryStub.onCall(1).resolves([[mockedUser]]);

    await register(req, res);

    expect(res.created.calledOnce).to.be.true;
    expect(
      res.created.calledWith(
        { user: { firstName: "John", lastName: "Doe", email: "email" } },
        "User created"
      )
    ).to.be.true;
  });

  it("should return conflict if user already exists", async () => {
    const mockedUser = {
      password: "hashed_password",
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
    };

    connectionQueryStub.onCall(0).resolves([[mockedUser]]);
    await register(req, res);

    expect(res.conflict.calledOnce).to.be.true;
    expect(res.conflict.calledWith("User already exists")).to.be.true;
  });
});
