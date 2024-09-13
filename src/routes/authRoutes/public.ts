import { Router } from "express";
import { login, register } from "../../controllers";

export const publicAuthRouter = Router();

publicAuthRouter.post("/login", login);
publicAuthRouter.post("/register", register);
