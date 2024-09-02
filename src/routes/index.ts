import { Router } from "express";
import { publicAuthRouter } from "./authRoutes/public";
import { privateUserRouter } from "./userRoutes/privateUserRouter";
import { verifyToken } from "../middlewares";
import { privateChatRouter } from "./chatRoutes/privateChatRouter";

const router = Router();

router.use("/auth", publicAuthRouter);

router.use("/user", verifyToken, privateUserRouter);

router.use("/chat", verifyToken, privateChatRouter);

export default router;
