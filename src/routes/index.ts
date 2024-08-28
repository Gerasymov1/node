import { Router } from "express";
import { userRouter } from "./public";
import { securedRouter } from "./secured";

const router = Router();

router.use(userRouter);
router.use(securedRouter);

export default router;
