import { updateUser } from "../usersControllers.ts";
import { expect } from "chai";
import sinon, { SinonStub } from "sinon";
import { restoreSandbox, setupSandbox } from "../../heplers/testHelpers.ts";

describe("update user", () => {
  let req: any;
  let res: any;
  let sandbox: sinon.SinonSandbox;
  let connectionQueryStub: sinon.SinonStub;
  let connectionExecuteStub: SinonStub;

  beforeEach(() => {
    const setup = setupSandbox({
      body: {
        firstName: "John",
        lastName: "Doe",
        password: "password123",
        email: "john.doe@example.com",
      },
    });
    req = setup.req;
    res = setup.res;
    sandbox = setup.sandbox;
    connectionQueryStub = setup.connectionQueryStub;
    connectionExecuteStub = setup.connectionExecuteStub;
  });

  afterEach(() => {
    restoreSandbox(sandbox);
  });

  it("should return bad request if the user does not fill all required fields", async () => {
    req.body.firstName = "";

    await updateUser(req, res);

    expect(res.badRequest.calledOnce).to.be.true;
    expect(res.badRequest.calledWith("Invalid request, fill in all fields")).to
      .be.true;
  });

  it("should return user not found", async () => {
    connectionExecuteStub.resolves([[]]);

    await updateUser(req, res);

    expect(res.notFound.calledOnce).to.be.true;
    expect(res.notFound.calledWith("User not found")).to.be.true;
  });

  it("should find the user", async () => {
    const mockedUser = {
      id: 123,
      email: "john.doe@example.com",
    };

    connectionExecuteStub.resolves([[mockedUser]]);

    await updateUser(req, res);

    expect(connectionExecuteStub.calledOnce).to.be.true;
    expect(
      connectionExecuteStub.calledWith("SELECT * FROM Users WHERE id = ?;", [
        123,
      ])
    ).to.be.true;
    expect(res.notFound.called).to.be.false;
  });

  it("should update the user when valid data is provided", async () => {
    const mockedUser = {
      id: 123,
      email: "john.doe@example.com",
    };

    connectionExecuteStub.onCall(0).resolves([[mockedUser]]);
    connectionQueryStub.onCall(0).resolves([{}]);

    await updateUser(req, res);

    expect(connectionExecuteStub.calledOnce).to.be.true;
    expect(connectionQueryStub.calledOnce).to.be.true;

    expect(
      connectionQueryStub.calledWith(
        "UPDATE Users SET firstName = ?, lastName = ?, password = ?, email = ? WHERE id = ?;",
        ["John", "Doe", sinon.match.string, "john.doe@example.com", 123]
      )
    ).to.be.true;

    expect(res.status.calledWith(204)).to.be.true;
    expect(res.send.calledOnce).to.be.true;
  });

  it("should return 500 if an error occurs", async () => {
    connectionQueryStub.rejects(new Error("Test error"));

    await updateUser(req, res);

    expect(res.internalServerError.calledOnce).to.be.true;
    expect(res.internalServerError.calledWith("Error updating user")).to.be
      .true;
  });
});
