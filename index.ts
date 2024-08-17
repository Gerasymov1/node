import express from "express";

import { PORT } from "./src/constants";
import router from "./src/routes";
import { handleSetHeaders } from "./src/middlewares";

declare global {
  namespace Express {
    export interface Request {
      userIndex?: number;
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
