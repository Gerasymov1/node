import { Router } from "express";
import { createChat, deleteChat, editChat } from "../../controllers";

export const privateChatsRouter = Router();

privateChatsRouter.post("/", createChat);
privateChatsRouter.delete("/:id", deleteChat);
privateChatsRouter.patch("/:id", editChat);
