import express from "express";

import { MOCKED_USERS, PORT } from "./src/constants";
import { User } from "./src/types";
import { handleIndexByUserId } from "./src/middlewares";

const app = express();

app.use(express.json());

declare global {
  namespace Express {
    export interface Request {
      userIndex?: number;
    }
  }
}

app.get("/", (_, res) => {
  res.status(201).send({ message: "Hello World" });
});

app.get("/api/users", (request, response) => {
  const {
    query: { filter, value },
  } = request;

  if (filter && value) {
    const users = MOCKED_USERS.filter((user: User) => {
      const userValue = user[filter as keyof User];

      if (typeof userValue === "string" && typeof value === "string") {
        return userValue.toLowerCase().includes(value.toLowerCase());
      }

      return false;
    });

    return response.send(users);
  }

  return response.send(MOCKED_USERS);
});

app.get("/api/users/:id", handleIndexByUserId, (request, response) => {
  const { userIndex } = request;

  const user = MOCKED_USERS[userIndex as number];

  if (!user) {
    response.sendStatus(404);
  }

  return response.send(user);
});

app.post("/api/users", (request, response) => {
  const { username, displayName } = request.body;

  if (!username || !displayName) {
    response.status(400).send({ message: "Invalid data" });
  }

  const id = MOCKED_USERS[MOCKED_USERS.length - 1].id + 1;

  const newUser = {
    id,
    username,
    displayName,
  };

  MOCKED_USERS.push(newUser);

  return response.status(201).send(newUser);
});

app.put("/api/users/:id", handleIndexByUserId, (request, response) => {
  const { body, userIndex } = request;

  MOCKED_USERS[userIndex as number] = {
    id: MOCKED_USERS[userIndex as number].id,
    ...body,
  };

  return response.sendStatus(204);
});

app.patch("/api/users/:id", (request, response) => {
  const { body, userIndex } = request;

  MOCKED_USERS[userIndex as number] = {
    ...MOCKED_USERS[userIndex as number],
    ...body,
  };

  return response.sendStatus(204);
});

app.delete("/api/users/:id", (request, response) => {
  const { userIndex } = request;

  MOCKED_USERS.splice(userIndex as number, 1);

  return response.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
