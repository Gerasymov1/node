import sinon from "sinon";
import { restoreSandbox, setupSandbox } from "../../heplers/testHelpers.ts";
import { login } from "../authControllers.ts";
import { expect } from "chai";
import bcrypt from "bcrypt";

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
      password: "hashed_password",
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      id: 123,
    };

    req.body.password = "hashed_password";
    req.body.email = "john.doe@example.com";

    connectionQueryStub.onCall(0).resolves([[mockedUser]]);
    bcryptStub.onCall(0).resolves(true);
    generateTokensStub.onCall(0).resolves({
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    });
    connectionExecuteStub.onCall(0).resolves([[mockedUser]]);
    connectionQueryStub.onCall(1).resolves([[mockedUser]]);

    await login(req, res);

    expect(res.success.calledOnce).to.be.true;
    expect(
      res.success.calledWith(
        {
          user: {
            firstName: mockedUser.firstName,
            lastName: mockedUser.lastName,
            email: mockedUser.email,
          },
        },
        "Logged in"
      )
    ).to.be.true;
  });
});
