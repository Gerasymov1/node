import { Router } from "express";
import { updateUser } from "../../controllers";

export const privateUsersRouter = Router();

privateUsersRouter.patch("/", updateUser);
