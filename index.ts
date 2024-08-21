import express from "express";

import { PORT } from "./src/constants";
import router from "./src/routes";
import { handleSetHeaders } from "./src/middlewares";

import { db } from "./src/settings/db";

const app = express();

app.use(express.json());

app.use(handleSetHeaders);

app.use(router);

app.get("/test", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }

    res.status(200).send(results);
  });
});

app.get("/", (_, res) => {
  res.status(201).send({ message: "Hello World" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
