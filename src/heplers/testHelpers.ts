import sinon, { SinonSandbox } from "sinon";
import connection from "../settings/db.ts";

type Props = {
  body?: {
    [key: string]: string | number | boolean;
  };
};

export function setupSandbox({ body }: Props) {
  const sandbox = sinon.createSandbox();
  const connectionQueryStub = sandbox.stub(connection, "query");
  const connectionExecuteStub = sandbox.stub(connection, "execute");

  const req = {
    user: {
      id: 123,
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
    },
    body,
  };

  const res = {
    badRequest: sandbox.stub().returnsThis(),
    internalServerError: sandbox.stub().returnsThis(),
    success: sandbox.stub().returnsThis(),
    created: sandbox.stub().returnsThis(),
    notFound: sandbox.stub().returnsThis(),
    status: sandbox.stub().returnsThis(),
    send: sandbox.stub().returnsThis(),
  };

  return { req, res, sandbox, connectionQueryStub, connectionExecuteStub };
}

export function restoreSandbox(sandbox: SinonSandbox): void {
  sandbox.restore();
}
