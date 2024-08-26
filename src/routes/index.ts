import { Router } from "express";
import { usersRouter } from "./users";
import { authRouter } from "./public";
import { securedRouter } from "./secured";

const router = Router();

router.use(usersRouter);
router.use(authRouter);
router.use(securedRouter);

export default router;
