import { Router } from "express";
import { createChat, deleteChat, editChat } from "../../controllers";

export const privateChatsRouter = Router();

privateChatsRouter.post("/", createChat);
privateChatsRouter.delete("/", deleteChat);
privateChatsRouter.patch("/edit", editChat);
