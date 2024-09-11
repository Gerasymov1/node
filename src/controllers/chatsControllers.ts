import connection from "../settings/db";
import { Request, Response } from "express";
import {
  deleteChatQuery,
  findChatQuery,
  insertChatQuery,
  updateChatQuery,
} from "../queries";
import logger from "../config/logger";

export const getChats = async (req: Request, res: Response) => {
  const creatorId = req.user?.id;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search || "";

  if (!creatorId) {
    logger.info("CreatorId is required");
    return res.badRequest("CreatorId is required");
  }

  const offset = (page - 1) * limit;

  const query = `
    SELECT * FROM chats
    WHERE creatorId = ? AND (title LIKE ?)
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?;
  `;

  const searchPattern = `%${search}%`;

  try {
    const [chats]: any = await connection.query(query, [
      creatorId,
      searchPattern,
      limit,
      offset,
    ]);

    if (!chats.length) {
      return res.notFound("Chats not found");
    }

    res.success({ chats }, "Chats found");
  } catch (error) {
    logger.error(error);
    res.internalServerError("Server error");
  }
};

export const createChat = async (req: Request, res: Response) => {
  const { title } = req.body;
  const creatorId = req.user?.id;

  if (!title || !creatorId) {
    logger.info("Title and creatorId are required");
    return res.badRequest("Title and creatorId are required");
  }

  try {
    await connection.query(insertChatQuery, [title, creatorId]);
    res.created({ title }, "Chat created");
  } catch (error) {
    logger.error(error);
    res.internalServerError("Server error");
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  const { id } = req.params;
  const creatorId = req.user?.id;

  if (!id) {
    logger.info("ChatId is required");
    return res.badRequest("ChatId is required");
  }

  try {
    const [chat]: any = await connection.query(findChatQuery, [id]);
    if (chat[0].creatorId !== creatorId) {
      return res.permissionDenied("Permission denied");
    }

    if (!chat.length) {
      return res.unauthorized("Unauthorized");
    }
  } catch (error) {
    logger.error(error);
    res.internalServerError("Server error");
  }

  try {
    await connection.query(deleteChatQuery, [id]);
    res.success({}, "Chat deleted");
  } catch (error) {
    logger.error(error);
    res.internalServerError("Server error");
  }
};

export const editChat = async (req: Request, res: Response) => {
  const { title } = req.body;
  const { id } = req.params;
  const creatorId = req.user?.id;

  if (!id || !title) {
    logger.info("ChatId and title are required");
    return res.badRequest("ChatId and title are required");
  }

  try {
    const [chat]: any = await connection.query(findChatQuery, [id]);
    if (chat[0].creatorId !== creatorId) {
      return res.permissionDenied("Permission denied");
    }

    if (!chat.length) {
      return res.notFound("Chat not found");
    }
  } catch (error) {
    logger.error(error);
    res.internalServerError("Server error");
  }

  try {
    await connection.query(updateChatQuery, [title, id]);
    res.success({ title }, "Chat updated");
  } catch (error) {
    logger.error(error);
    res.internalServerError("Server error");
  }
};
