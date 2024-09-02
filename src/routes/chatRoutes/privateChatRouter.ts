import { Router } from "express";
import {
  createChat,
  deleteChat,
  editChat,
} from "../../controllers/chatControllers";

export const privateChatRouter = Router();

privateChatRouter.post("/create", createChat);
privateChatRouter.delete("/delete", deleteChat);
privateChatRouter.patch("/edit", editChat);
