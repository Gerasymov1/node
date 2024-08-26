import { Router } from "express";
import { usersRouter } from "./users";
import { authRouter } from "./public";
import { basicRouter } from "./secured";

const router = Router();

router.use(usersRouter);
router.use(authRouter);
router.use(basicRouter);

export default router;
