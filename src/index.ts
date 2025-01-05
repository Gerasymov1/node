import express from "express";
import cookieParser from "cookie-parser";

import router from "./routes/index.js";
import { handleSetHeaders } from "./middlewares/index.ts";
import { PORT } from "./constants/index.ts";
import { responseMiddleware } from "./middlewares/response.ts";

const app = express();

app.use(cookieParser());

console.log("Hello World");

app.use(express.json());

app.use(handleSetHeaders);

app.use(responseMiddleware);

app.use("/api", router);

app.get("/", (_, res) => {
  res.status(201).send({ message: "Hello World" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
