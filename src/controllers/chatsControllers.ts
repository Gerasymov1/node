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
    return res.status(400).json({ message: "CreatorId is required" });
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
      return res.status(404).json({ message: "Chats not found" });
    }

    res.status(200).json(chats);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createChat = async (req: Request, res: Response) => {
  const { title } = req.body;
  const creatorId = req.user?.id;

  if (!title || !creatorId) {
    logger.info("Title and creatorId are required");
    return res
      .status(400)
      .json({ message: "Title and creatorId are required" });
  }

  try {
    await connection.query(insertChatQuery, [title, creatorId]);
    res.status(201).json({ message: "Chat created" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    logger.info("ChatId is required");
    return res.status(400).json({ message: "ChatId is required" });
  }

  try {
    const [chat]: any = await connection.query(findChatQuery, [id]);
    if (!chat.length) {
      return res.status(404).json({ message: "Chat not found" });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server error" });
  }

  try {
    await connection.query(deleteChatQuery, [id]);
    res.status(200).json({ message: "Chat deleted" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const editChat = async (req: Request, res: Response) => {
  const { title } = req.body;
  const { id } = req.params;

  if (!id || !title) {
    logger.info("ChatId and title are required");
    return res.status(400).json({ message: "ChatId and title are required" });
  }

  try {
    const [chat]: any = await connection.query(findChatQuery, [id]);
    if (!chat.length) {
      return res.status(404).json({ message: "Chat not found" });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server error" });
  }

  try {
    await connection.query(updateChatQuery, [title, id]);
    res.status(200).json({ message: "Chat updated" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
