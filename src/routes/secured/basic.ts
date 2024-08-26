import { authenticate } from "../../middlewares";
import { Router } from "express";

export const basicRouter = Router();

basicRouter.get("/api/secured", authenticate, (req, res) => {
  res.send({ message: "You are authenticated" });
});
