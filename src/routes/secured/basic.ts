import { authenticate } from "../../middlewares";
import { Router } from "express";

export const securedRouter = Router();

securedRouter.get("/api/secured", authenticate, (req, res) => {
  res.send({ message: "You are authenticated", user: req.user });
});
