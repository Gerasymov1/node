import { Router } from "express";
import { updateUser } from "../../controllers";

export const privateUserRouter = Router();

privateUserRouter.patch("/", updateUser);
