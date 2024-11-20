import { Router } from "express";
import { updateUser } from "../../controllers/index.ts";

export const privateUsersRouter = Router();

privateUsersRouter.patch("/", updateUser);
