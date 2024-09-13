import { Router } from "express";
import { publicAuthRouter } from "./authRoutes/public";
import { privateUsersRouter } from "./usersRoutes/privateUsersRouter";
import { verifyToken } from "../middlewares";
import { privateChatsRouter } from "./chatsRoutes/privateChatsRouter";

const router = Router();

router.use("/auth", publicAuthRouter);

router.use("/users", verifyToken, privateUsersRouter);

router.use("/chats", verifyToken, privateChatsRouter);

export default router;
