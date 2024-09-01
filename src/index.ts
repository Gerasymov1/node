import express from "express";
import cookieParser from "cookie-parser";

import router from "./routes/index.js";
import { User } from "./types";
import { handleSetHeaders } from "./middlewares";
import { PORT } from "./constants";

declare global {
  namespace Express {
    interface Request {
      user?: Partial<User>;
    }
  }
}

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(handleSetHeaders);

app.use("/api", router);

app.get("/", (_, res) => {
  res.status(201).send({ message: "Hello World" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
