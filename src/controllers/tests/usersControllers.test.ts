import { updateUser } from "../usersControllers";
import { expect } from "chai";
import sinon, { SinonStub } from "sinon";
import connection from "../../settings/db.ts";

describe("update user", () => {
  let req: any,
    res: any,
    sandbox: sinon.SinonSandbox,
    connectionExecuteStub: SinonStub,
    connectionQueryStub: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    connectionExecuteStub = sandbox.stub(connection, "execute");
    connectionQueryStub = sandbox.stub(connection, "query");

    req = {
      body: {
        firstName: "John",
        lastName: "Doe",
        password: "password123",
        email: "john.doe@example.com",
      },
      user: {
        id: 123,
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
      },
    };

    res = {
      status: sandbox.stub().returnsThis(),
      send: sandbox.stub().returnsThis(),
      badRequest: sandbox.stub().returnsThis(),
      notFound: sandbox.stub().returnsThis(),
      permissionDenied: sandbox.stub().returnsThis(),
      unauthorized: sandbox.stub().returnsThis(),
      internalServerError: sandbox.stub().returnsThis(),
      conflict: sandbox.stub().returnsThis(),
      success: sandbox.stub().returnsThis(),
      created: sandbox.stub().returnsThis(),
    };
  });

  afterEach(() => {
    sandbox.restore();
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
