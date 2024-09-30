import { Request, Response } from "express";
import {
  createChat as createChatQuery,
  deleteChat as deleteChatQuery,
  findChat as findChatQuery,
  getChats as getChatsQuery,
  updateChat as updateChatQuery,
} from "../queries";
import logger from "../config/logger";

export const getChats = async (req: Request, res: Response) => {
  const creatorId = req.user?.id;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search || "";

  if (!creatorId) {
    logger.child({ childData: { creatorId } }).info("CreatorId is required");
    return res.badRequest("CreatorId is required");
  }

  const offset = (page - 1) * limit;

  const searchPattern = `%${search}%`;

  try {
    const chats: any = await getChatsQuery(
      creatorId,
      searchPattern,
      limit,
      offset
    );

    res.success({ chats }, "Chats found");
  } catch (error) {
    logger
      .child({
        childData: {
          creatorId,
          searchPattern,
          limit,
          offset,
        },
      })
      .error(error);

    console.log("Error getting chats", error);

    res.internalServerError("Server error");
  }
};

export const createChat = async (req: Request, res: Response) => {
  const { title } = req.body;
  const creatorId = req.user?.id;

  if (!title || !creatorId) {
    logger
      .child({
        childData: {
          title,
          creatorId,
        },
      })
      .info("Title and creatorId are required");
    return res.badRequest("Title and creatorId are required");
  }

  try {
    await createChatQuery(title, creatorId);
    res.created({ title }, "Chat created");
  } catch (error) {
    logger
      .child({
        childData: {
          title,
          creatorId,
        },
      })
      .error(error);

    console.log("Error creating chat", error);

    res.internalServerError("Server error");
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  const { id } = req.params;
  const creatorId = req.user?.id;

  if (!id) {
    logger
      .child({
        childData: { chatId: id, creatorId },
      })
      .info("ChatId is required");
    return res.badRequest("ChatId is required");
  }

  try {
    const chat: any = await findChatQuery(Number(id));

    if (!chat) {
      return res.notFound("Chat not found");
    }

    if (chat?.creatorId !== creatorId) {
      return res.permissionDenied("Permission denied");
    }

    await deleteChatQuery(Number(id));
    res.success({}, "Chat deleted");
  } catch (error) {
    logger
      .child({
        childData: { chatId: id, creatorId },
      })
      .error(error);

    console.log("Error deleting chat", error);

    res.internalServerError("Server error");
  }
};

export const editChat = async (req: Request, res: Response) => {
  const { title } = req.body;
  const { id } = req.params;
  const creatorId = req.user?.id;

  if (!id || !title) {
    logger
      .child({
        childData: { chatId: id, title, creatorId },
      })
      .info("ChatId and title are required");
    return res.badRequest("ChatId and title are required");
  }

  try {
    const chat: any = await findChatQuery(Number(id));
    if (!chat) {
      return res.notFound("Chat not found");
    }

    if (chat?.creatorId !== creatorId) {
      return res.permissionDenied("Permission denied");
    }

    await updateChatQuery(title, Number(id));
    res.success({ title }, "Chat updated");
  } catch (error) {
    logger
      .child({
        childData: { chatId: id, title, creatorId },
      })
      .error(error);

    console.log("Error updating chat", error);

    res.internalServerError("Server error");
  }
};
