import express from "express";

import { mockedUsers, PORT } from "./src/constants";
import { User } from "./src/types";

const app = express();

app.use(express.json());

app.get("/", (_, res) => {
  res.status(201).send({ message: "Hello World" });
});

app.get("/api/users", (request, response) => {
  const {
    query: { filter, value },
  } = request;

  if (filter && value) {
    const users = mockedUsers.filter((user: User) => {
      const userValue = user[filter as keyof User];

      if (typeof userValue === "string" && typeof value === "string") {
        return userValue.toLowerCase().includes(value.toLowerCase());
      }

      return false;
    });

    return response.send(users);
  }

  return response.send(mockedUsers);
});

app.get("/api/users/:id", (request, response) => {
  const { id } = request.params;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    response.status(400).send({ message: "Invalid ID" });
  }

  const user = mockedUsers.find((user) => user.id === parsedId);

  if (!user) {
    response.sendStatus(404);
  }

  response.send(user);
});

app.post("/api/users", (request, response) => {
  const { username, displayName } = request.body;

  if (!username || !displayName) {
    response.status(400).send({ message: "Invalid data" });
  }

  const id = mockedUsers[mockedUsers.length - 1].id + 1;

  const newUser = {
    id,
    username,
    displayName,
  };

  mockedUsers.push(newUser);

  return response.status(201).send(newUser);
});

app.put("/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return response.sendStatus(400);
  }

  const userIndex = mockedUsers.findIndex((user) => user.id === parsedId);

  if (userIndex === -1) {
    return response.sendStatus(404);
  }

  mockedUsers[userIndex] = {
    id: parsedId,
    ...body,
  };

  return response.sendStatus(204);
});

app.patch("/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return response.sendStatus(400);
  }

  const userIndex = mockedUsers.findIndex((user) => user.id === parsedId);

  if (userIndex === -1) {
    return response.sendStatus(404);
  }

  mockedUsers[userIndex] = {
    ...mockedUsers[userIndex],
    ...body,
  };

  return response.sendStatus(204);
});

app.delete("/api/users/:id", (request, response) => {
  const { id } = request.params;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return response.sendStatus(400);
  }

  const userIndex = mockedUsers.findIndex((user) => user.id === parsedId);

  if (userIndex === -1) {
    return response.sendStatus(404);
  }

  mockedUsers.splice(userIndex, 1);

  return response.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
