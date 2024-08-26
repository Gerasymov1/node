import express from "express";

import { PORT } from "./src/constants";
import router from "./src/routes";
import { handleSetHeaders } from "./src/middlewares";

import { initializeTables } from "./src/models";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const app = express();

app.use(express.json());

app.use(handleSetHeaders);

app.use(router);

app.get("/", (_, res) => {
  res.status(201).send({ message: "Hello World" });
});

const start = () => {
  initializeTables().then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  });
};

start();
