import { Router } from "express";
import { publicAuthRouter } from "./authRoutes/public.js";
import { privateUsersRouter } from "./usersRoutes/privateUsersRouter.ts";
import { verifyToken } from "../middlewares/index.ts";
import { privateChatsRouter } from "./chatsRoutes/privateChatsRouter.ts";

const router = Router();

router.use("/auth", publicAuthRouter);

router.use("/users", verifyToken, privateUsersRouter);

router.use("/chats", verifyToken, privateChatsRouter);

export default router;
