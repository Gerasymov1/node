import { Router } from "express";
import { MOCKED_USERS } from "../constants";
import { User } from "../types";

export const usersRouter = Router();

usersRouter.get("/api/users", (request, response) => {
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

usersRouter.get("/api/users/:id", (request, response) => {
  const {
    params: { id },
  } = request;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return response.sendStatus(400);
  }

  const userIndex = MOCKED_USERS.findIndex((user) => user.id === parsedId);

  if (userIndex === -1) {
    return response.sendStatus(404);
  }

  const user = MOCKED_USERS[userIndex as number];

  if (!user) {
    response.sendStatus(404);
  }

  return response.send(user);
});

usersRouter.post("/api/users", (request, response) => {
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

usersRouter.put("/api/users/:id", (request, response) => {
  const {
    params: { id },
    body,
  } = request;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return response.sendStatus(400);
  }

  const userIndex = MOCKED_USERS.findIndex((user) => user.id === parsedId);

  if (userIndex === -1) {
    return response.sendStatus(404);
  }

  MOCKED_USERS[userIndex as number] = {
    id: MOCKED_USERS[userIndex as number].id,
    ...body,
  };

  return response.sendStatus(204);
});

usersRouter.patch("/api/users/:id", (request, response) => {
  const {
    params: { id },
    body,
  } = request;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return response.sendStatus(400);
  }

  const userIndex = MOCKED_USERS.findIndex((user) => user.id === parsedId);

  if (userIndex === -1) {
    return response.sendStatus(404);
  }

  MOCKED_USERS[userIndex as number] = {
    ...MOCKED_USERS[userIndex as number],
    ...body,
  };

  return response.sendStatus(204);
});

usersRouter.delete("/api/users/:id", (request, response) => {
  const {
    params: { id },
  } = request;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return response.sendStatus(400);
  }

  const userIndex = MOCKED_USERS.findIndex((user) => user.id === parsedId);

  if (userIndex === -1) {
    return response.sendStatus(404);
  }

  MOCKED_USERS.splice(userIndex as number, 1);

  return response.sendStatus(204);
});
