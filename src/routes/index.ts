import { Router } from "express";
import { publicAuthRouter } from "./authRouts/public";
import { privateUserRouter } from "./userRouts/privateUserRouter";
import { verifyToken } from "../middlewares";

const router = Router();

router.use("/auth", publicAuthRouter);

router.use("/user", verifyToken, privateUserRouter);

export default router;
