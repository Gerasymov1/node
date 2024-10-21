import {
  getChats,
  createChat,
  deleteChat,
  editChat,
  inviteUserToChat,
} from "../chatsControllers.ts";
import { expect } from "chai";
import sinon, { SinonStub } from "sinon";
import connection from "../../settings/db.ts";

describe("get chats", () => {
  let req: any,
    res: any,
    sandbox: sinon.SinonSandbox,
    connectionQueryStub: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    connectionQueryStub = sandbox.stub(connection, "query");

    req = {
      user: {
        id: 123,
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
      },
    };

    res = {
      badRequest: sandbox.stub().returnsThis(),
      internalServerError: sandbox.stub().returnsThis(),
      success: sandbox.stub().returnsThis(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return bad request if creatorId is not provided", async () => {
    connectionQueryStub.returns([]);
    req.query = { search: "test" };
    req.user = { id: null };
    await getChats(req, res);

    expect(res.badRequest.calledOnce).to.be.true;
    expect(res.badRequest.calledWith("CreatorId is required")).to.be.true;
  });

  it("should return chats", async () => {
    const mockedChats = [{ id: 1, title: "Test chat" }];
    const mockedQuery = { search: "test", page: 1, limit: 10 };

    connectionQueryStub.returns([mockedChats]);
    req.query = mockedQuery;

    await getChats(req, res);

    expect(res.success.calledOnce).to.be.true;
    expect(res.success.calledWith({ chats: mockedChats }, "Chats found")).to.be
      .true;
  });

  it("should return internal server error", async () => {
    connectionQueryStub.throws(new Error("Server error"));
    req.query = { search: "test" };

    await getChats(req, res);

    expect(res.internalServerError.calledOnce).to.be.true;
    expect(res.internalServerError.calledWith("Server error")).to.be.true;
  });
});

describe("create chat", () => {
  let req: any,
    res: any,
    sandbox: sinon.SinonSandbox,
    connectionQueryStub: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    connectionQueryStub = sandbox.stub(connection, "query");

    req = {
      user: {
        id: 123,
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
      },
    };

    res = {
      badRequest: sandbox.stub().returnsThis(),
      internalServerError: sandbox.stub().returnsThis(),
      success: sandbox.stub().returnsThis(),
      created: sandbox.stub().returnsThis(),
      notFound: sandbox.stub().returnsThis(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return bad request if title is not provided", async () => {
    req.body = { title: "" };
    await createChat(req, res);

    expect(res.badRequest.calledOnce).to.be.true;
    expect(res.badRequest.calledWith("Title and creatorId are required")).to.be
      .true;
  });

  it("should return bad request if creatorId is not provided", async () => {
    req.body = { title: "Test chat" };
    req.user = { id: null };
    await createChat(req, res);

    expect(res.badRequest.calledOnce).to.be.true;
    expect(res.badRequest.calledWith("Title and creatorId are required")).to.be
      .true;
  });

  it("should return chat created", async () => {
    const mockedChat = { title: "Test chat" };
    connectionQueryStub.returns([mockedChat]);
    req.body = { title: "Test chat" };

    await createChat(req, res);

    expect(res.created.calledOnce).to.be.true;
    expect(res.created.calledWith({ title: "Test chat" }, "Chat created")).to.be
      .true;
  });

  it("should return internal server error", async () => {
    connectionQueryStub.throws(new Error("Server error"));
    req.body = { title: "Test chat" };

    await createChat(req, res);

    expect(res.internalServerError.calledOnce).to.be.true;
    expect(res.internalServerError.calledWith("Server error")).to.be.true;
  });
});

describe("delete chat", () => {
  let req: any,
    res: any,
    sandbox: sinon.SinonSandbox,
    connectionQueryStub: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    connectionQueryStub = sandbox.stub(connection, "query");

    req = {
      user: {
        id: 123,
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
      },
    };

    res = {
      badRequest: sandbox.stub().returnsThis(),
      internalServerError: sandbox.stub().returnsThis(),
      success: sandbox.stub().returnsThis(),
      created: sandbox.stub().returnsThis(),
      notFound: sandbox.stub().returnsThis(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return bad request if chatId is not provided", async () => {
    req.params = { chatId: "" };
    await deleteChat(req, res);

    expect(res.badRequest.calledOnce).to.be.true;
    expect(res.badRequest.calledWith("ChatId is required")).to.be.true;
  });

  it("should return not found chat", async () => {
    connectionQueryStub.returns([[]]);
    req.params = { id: 1 };

    await deleteChat(req, res);

    expect(res.notFound.calledOnce).to.be.true;
    expect(res.notFound.calledWith("Chat not found")).to.be.true;
  });

  it("should return internal server error", async () => {
    connectionQueryStub.throws(new Error("Server error"));
    req.params = { id: 1 };

    await deleteChat(req, res);

    expect(res.internalServerError.calledOnce).to.be.true;
    expect(res.internalServerError.calledWith("Server error")).to.be.true;
  });

  it("should delete chat successfully", async () => {
    const chat = { creatorId: 123 };

    req.params = { id: 1 };

    connectionQueryStub.onCall(0).resolves([[chat]]);
    connectionQueryStub.onCall(1).resolves([{}]);

    await deleteChat(req, res);

    expect(res.success.calledOnce).to.be.true;
    expect(res.success.calledWith({}, "Chat deleted")).to.be.true;
  });
});

describe("edit chat", () => {
  let req: any,
    res: any,
    sandbox: sinon.SinonSandbox,
    connectionQueryStub: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    connectionQueryStub = sandbox.stub(connection, "query");

    req = {
      user: {
        id: 123,
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
      },
      body: {
        title: "Test chat",
      },
    };

    res = {
      badRequest: sandbox.stub().returnsThis(),
      internalServerError: sandbox.stub().returnsThis(),
      success: sandbox.stub().returnsThis(),
      created: sandbox.stub().returnsThis(),
      notFound: sandbox.stub().returnsThis(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return bad request if chatId is not provided", async () => {
    req.params = { chatId: "" };
    await editChat(req, res);

    expect(res.badRequest.calledOnce).to.be.true;
    expect(res.badRequest.calledWith("ChatId and title are required")).to.be
      .true;
  });

  it("should return bad request if title is not provided", async () => {
    req.params = { chatId: 1 };
    req.body = { title: "" };
    await editChat(req, res);

    expect(res.badRequest.calledOnce).to.be.true;
    expect(res.badRequest.calledWith("ChatId and title are required")).to.be
      .true;
  });

  it("should return not found chat", async () => {
    connectionQueryStub.returns([[]]);
    req.params = { id: 1 };

    await editChat(req, res);

    expect(res.notFound.calledOnce).to.be.true;
    expect(res.notFound.calledWith("Chat not found")).to.be.true;
  });

  it("should return internal server error", async () => {
    connectionQueryStub.throws(new Error("Server error"));
    req.params = { id: 1 };

    await editChat(req, res);

    expect(res.internalServerError.calledOnce).to.be.true;
    expect(res.internalServerError.calledWith("Server error")).to.be.true;
  });

  it("should edit chat successfully", async () => {
    const chat = { creatorId: 123 };

    req.params = { id: 1 };

    connectionQueryStub.onCall(0).resolves([[chat]]);
    connectionQueryStub.onCall(1).resolves([{}]);

    await editChat(req, res);

    expect(res.success.calledOnce).to.be.true;
    expect(res.success.calledWith({ title: req.body.title }, "Chat updated")).to
      .be.true;
  });
});

describe("invite user to chat", () => {
  let req: any,
    res: any,
    sandbox: sinon.SinonSandbox,
    connectionQueryStub: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    connectionQueryStub = sandbox.stub(connection, "query");

    req = {
      user: {
        id: 123,
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
      },
      body: {
        userId: 1,
      },
    };

    res = {
      badRequest: sandbox.stub().returnsThis(),
      internalServerError: sandbox.stub().returnsThis(),
      success: sandbox.stub().returnsThis(),
      created: sandbox.stub().returnsThis(),
      notFound: sandbox.stub().returnsThis(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return bad request if chatId is not provided", async () => {
    req.params = { chatId: "" };
    await inviteUserToChat(req, res);

    expect(res.badRequest.calledOnce).to.be.true;
    expect(res.badRequest.calledWith("ChatId and userId are required")).to.be
      .true;
  });

  it("should return bad request if userId is not provided", async () => {
    req.params = { chatId: 1 };
    req.body = { userId: "" };
    await inviteUserToChat(req, res);

    expect(res.badRequest.calledOnce).to.be.true;
    expect(res.badRequest.calledWith("ChatId and userId are required")).to.be
      .true;
  });

  it("should return not found chat", async () => {
    connectionQueryStub.returns([[]]);
    req.params = { id: 1 };

    await inviteUserToChat(req, res);

    expect(res.notFound.calledOnce).to.be.true;
    expect(res.notFound.calledWith("Chat not found")).to.be.true;
  });

  it("should return internal server error", async () => {
    connectionQueryStub.throws(new Error("Server error"));
    req.params = { id: 1 };

    await inviteUserToChat(req, res);

    expect(res.internalServerError.calledOnce).to.be.true;
    expect(res.internalServerError.calledWith("Server error")).to.be.true;
  });

  it("should invite user", async () => {
    const chat = { creatorId: 123 };

    req.params = { id: 1 };

    connectionQueryStub.onCall(0).resolves([[chat]]);
    connectionQueryStub.onCall(1).resolves([{}]);

    await inviteUserToChat(req, res);

    expect(res.success.calledOnce).to.be.true;
    expect(res.success.calledWith({}, "User invited to chat")).to.be.true;
  });
});
