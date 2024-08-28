import { Router } from "express";
import { login, register, updateUser } from "../../controllers";

export const userRouter = Router();

userRouter.post("/api/public/user/login", login);

userRouter.post("/api/public/user/registration", register);

userRouter.patch("/api/public/user", updateUser);
