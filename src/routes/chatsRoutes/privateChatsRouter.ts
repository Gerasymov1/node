import { Router } from "express";
import { createChat, deleteChat, editChat, getChats } from "../../controllers";

export const privateChatsRouter = Router();

privateChatsRouter.get("/", getChats);
privateChatsRouter.post("/", createChat);
privateChatsRouter.delete("/:id", deleteChat);
privateChatsRouter.patch("/:id", editChat);
