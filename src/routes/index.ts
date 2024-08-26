import { Router } from "express";
import { usersRouter } from "./users";
import { loginRouter } from "./public";
import { basicRouter } from "./secured";

const router = Router();

router.use(usersRouter);
router.use(loginRouter);
router.use(basicRouter);

export default router;
