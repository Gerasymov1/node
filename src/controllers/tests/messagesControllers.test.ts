import { expect } from "chai";
import sinon from "sinon";
import {
  createMessage,
  deleteMessage,
  editMessage,
  forwardMessage,
  getMessagesByChatId,
} from "../messagesControllers.ts";
import { restoreSandbox, setupSandbox } from "../../heplers/testHelpers.ts";

describe("get messages by chat id", () => {
  let req: any;
  let res: any;
  let sandbox: sinon.SinonSandbox;
  let connectionQueryStub: sinon.SinonStub;

  beforeEach(() => {
    const setup = setupSandbox({});
    req = setup.req;
    res = setup.res;
    sandbox = setup.sandbox;
    connectionQueryStub = setup.connectionQueryStub;
  });

  afterEach(() => {
    restoreSandbox(sandbox);
  });

  it("should return bad request if chatId is not provided", async () => {
    req.params = { chatId: "" };
    req.query = {
      page: 1,
      limit: 10,
      search: "",
    };
    await getMessagesByChatId(req, res);

    expect(res.badRequest.calledOnce).to.be.true;
    expect(res.badRequest.calledWith("ChatId is required")).to.be.true;
  });

  it("should return internal server error if query fails", async () => {
    req.params = { chatId: 1 };
    req.query = {
      page: 1,
      limit: 10,
      search: "",
    };
    connectionQueryStub.throws(new Error("Query failed"));
    await getMessagesByChatId(req, res);

    expect(res.internalServerError.calledOnce).to.be.true;
    expect(res.internalServerError.calledWith("Server error")).to.be.true;
  });

  it("should return messages if query is successful", async () => {
    const messages = [
      {
        id: 1,
        chatId: 1,
        creatorId: 123,
        text: "Hello",
        createdAt: "2021-09-01T12:00:00.000Z",
      },
    ];

    req.params = { chatId: 1 };
    req.query = {
      page: 1,
      limit: 10,
      search: "",
    };
    connectionQueryStub.returns([messages]);
    await getMessagesByChatId(req, res);

    expect(res.success.calledOnce).to.be.true;
    expect(res.success.calledWith({ messages }, "Messages retrieved")).to.be
      .true;
  });
});

describe("create message", () => {
  let req: any;
  let res: any;
  let sandbox: sinon.SinonSandbox;
  let connectionQueryStub: sinon.SinonStub;

  beforeEach(() => {
    const setup = setupSandbox({});
    req = setup.req;
    res = setup.res;
    sandbox = setup.sandbox;
    connectionQueryStub = setup.connectionQueryStub;
  });

  afterEach(() => {
    restoreSandbox(sandbox);
  });

  it("should return bad request if chatId is not provided", async () => {
    req.params = { chatId: "" };
    req.body = {
      text: "Hello",
    };
    await createMessage(req, res);

    expect(res.badRequest.calledOnce).to.be.true;
    expect(res.badRequest.calledWith("ChatId, text and creatorId are required"))
      .to.be.true;
  });

  it("should return internal server error if query fails", async () => {
    req.params = { chatId: 1 };
    req.body = {
      text: "Hello",
    };
    connectionQueryStub.throws(new Error("Query failed"));
    await createMessage(req, res);

    expect(res.internalServerError.calledOnce).to.be.true;
    expect(res.internalServerError.calledWith("Server error")).to.be.true;
  });

  it("should create message", async () => {
    req.params = { chatId: 1 };
    req.body = {
      text: "Hello",
    };
    connectionQueryStub.returns([[{ chatId: 1, text: "Hello" }]]);
    await createMessage(req, res);

    expect(res.created.calledOnce).to.be.true;
    expect(
      res.created.calledWith({ chatId: 1, text: "Hello" }, "Message created")
    ).to.be.true;
  });
});

describe("delete message", () => {
  let req: any;
  let res: any;
  let sandbox: sinon.SinonSandbox;
  let connectionQueryStub: sinon.SinonStub;

  beforeEach(() => {
    const setup = setupSandbox({});
    req = setup.req;
    res = setup.res;
    sandbox = setup.sandbox;
    connectionQueryStub = setup.connectionQueryStub;
  });

  afterEach(() => {
    restoreSandbox(sandbox);
  });

  it("should return bad request if messageId is not provided", async () => {
    req.params = { id: "" };
    await deleteMessage(req, res);

    expect(res.badRequest.calledOnce).to.be.true;
    expect(res.badRequest.calledWith("ChatId and id are required")).to.be.true;
  });

  it("should return internal server error if query fails", async () => {
    req.params = { id: 1, chatId: 1 };
    connectionQueryStub.throws(new Error("Query failed"));
    await deleteMessage(req, res);

    expect(res.internalServerError.calledOnce).to.be.true;
    expect(res.internalServerError.calledWith("Server error")).to.be.true;
  });

  it("should delete message", async () => {
    req.params = { id: 1, chatId: 1 };
    connectionQueryStub.returns([[{ chatId: 1, text: "Hello" }]]);
    await deleteMessage(req, res);

    expect(res.success.calledOnce).to.be.true;
    expect(res.success.calledWith({}, "Message deleted")).to.be.true;
  });
});

describe("edit message", () => {
  let req: any;
  let res: any;
  let sandbox: sinon.SinonSandbox;
  let connectionQueryStub: sinon.SinonStub;

  beforeEach(() => {
    const setup = setupSandbox({ body: { text: "Hello" } });
    req = setup.req;
    res = setup.res;
    sandbox = setup.sandbox;
    connectionQueryStub = setup.connectionQueryStub;
  });

  afterEach(() => {
    restoreSandbox(sandbox);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return bad request if messageId is not provided", async () => {
    req.params = { id: "", chatId: "" };
    req.body = {
      text: "",
    };
    await editMessage(req, res);

    expect(res.badRequest.calledOnce).to.be.true;
    expect(res.badRequest.calledWith("ChatId, id and text are required")).to.be
      .true;
  });

  it("should return internal server error if query fails", async () => {
    req.params = { id: 1, chatId: 1 };
    req.body = {
      text: "Hello",
    };
    connectionQueryStub.throws(new Error("Query failed"));
    await editMessage(req, res);

    expect(res.internalServerError.calledOnce).to.be.true;
    expect(res.internalServerError.calledWith("Server error")).to.be.true;
  });

  it("should edit message", async () => {
    req.params = { id: 1, chatId: 1 };
    req.body = {
      text: "Hello",
    };
    connectionQueryStub.returns([[{ chatId: 1, text: "Hello1" }]]);
    await editMessage(req, res);

    expect(res.success.calledOnce).to.be.true;
    expect(res.success.calledWith({}, "Message edited")).to.be.true;
  });
});

describe("forward message", () => {
  let req: any;
  let res: any;
  let sandbox: sinon.SinonSandbox;
  let connectionQueryStub: sinon.SinonStub;

  beforeEach(() => {
    const setup = setupSandbox({ body: { text: "Hello" } });
    req = setup.req;
    res = setup.res;
    sandbox = setup.sandbox;
    connectionQueryStub = setup.connectionQueryStub;
  });

  afterEach(() => {
    restoreSandbox(sandbox);
  });

  it("should return bad request if messageId is not provided", async () => {
    req.params = { id: "", chatId: "" };
    await forwardMessage(req, res);

    expect(res.badRequest.calledOnce).to.be.true;
    expect(res.badRequest.calledWith("ChatId, text and creatorId are required"))
      .to.be.true;
  });

  it("should return internal server error if query fails", async () => {
    req.params = { id: 1, chatId: 1 };
    req.body = {
      text: "Hello",
    };
    connectionQueryStub.throws(new Error("Query failed"));
    await forwardMessage(req, res);

    expect(res.internalServerError.calledOnce).to.be.true;
    expect(res.internalServerError.calledWith("Server error")).to.be.true;
  });

  it("should return message not found", async () => {
    req.params = { id: 1, chatId: 1 };
    req.body = {
      text: "Hello",
    };
    connectionQueryStub.returns([[]]);
    await forwardMessage(req, res);

    expect(res.notFound.calledOnce).to.be.true;
    expect(res.notFound.calledWith("Message not found")).to.be.true;
  });

  it("should not found been forwarded", async () => {
    const mockedMessage = { chatId: 1, text: "Hello1" };
    req.params = { id: 1, chatId: 1 };
    req.body = {
      text: "Hello",
    };

    connectionQueryStub.onCall(0).resolves([[mockedMessage]]);
    connectionQueryStub.onCall(1).resolves([{ affectedRows: 0 }]);

    await forwardMessage(req, res);

    expect(res.notFound.calledOnce).to.be.true;
    expect(res.notFound.calledWith("Message has not been forwarded")).to.be
      .true;
  });

  it("should forward message", async () => {
    const mockedMessage = { chatId: 1, text: "Hello1" };
    req.params = { id: 1, chatId: 1 };
    req.body = {
      text: "Hello",
    };

    connectionQueryStub.onCall(0).resolves([[mockedMessage]]);
    connectionQueryStub.onCall(1).resolves([{ affectedRows: 1 }]);

    await forwardMessage(req, res);

    expect(res.created.calledOnce).to.be.true;
    expect(res.created.calledWith(mockedMessage, "Message forwarded")).to.be
      .true;
  });
});
