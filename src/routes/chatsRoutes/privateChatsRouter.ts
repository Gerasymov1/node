import { Router } from "express";
import { createChat, deleteChat, editChat, getChats } from "../../controllers";
import { privateMessagesRouter } from "../messagesRoutes/privateMessagesRouter.ts";
import {
  createMessage,
  deleteMessage,
  editMessage,
  getMessagesByChatId,
} from "../../controllers/messagesControllers.ts";

export const privateChatsRouter = Router();

privateChatsRouter.get("/", getChats);
privateChatsRouter.post("/", createChat);
privateChatsRouter.delete("/:id", deleteChat);
privateChatsRouter.patch("/:id", editChat);

privateChatsRouter.use("/:chatId/messages", privateMessagesRouter);

privateMessagesRouter.get("/", getMessagesByChatId);
privateMessagesRouter.post("/", createMessage);
privateMessagesRouter.delete("/:id", deleteMessage);
privateMessagesRouter.patch("/:id", editMessage);
