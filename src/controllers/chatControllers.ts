import connection from "../settings/db";
import { Request, Response } from "express";
import {
  deleteChatQuery,
  findChatQuery,
  insertChatQuery,
  updateChatQuery,
} from "../queries";
import logger from "../config/logger";

export const createChat = async (req: Request, res: Response) => {
  const { title, creatorId } = req.body;

  if (!title || !creatorId) {
    logger.error("Title and creatorId are required");
    return res
      .status(400)
      .json({ message: "Title and creatorId are required" });
  }

  try {
    await connection.query(insertChatQuery, [title, creatorId]);
    res.status(201).json({ message: "Chat created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    logger.error("ChatId is required");
    return res.status(400).json({ message: "ChatId is required" });
  }

  try {
    const [chat]: any = await connection.query(findChatQuery, [id]);
    if (!chat.length) {
      return res.status(404).json({ message: "Chat not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }

  try {
    await connection.query(deleteChatQuery, [id]);
    res.status(200).json({ message: "Chat deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const editChat = async (req: Request, res: Response) => {
  const { id, title } = req.body;

  if (!id || !title) {
    logger.error("ChatId and title are required");
    return res.status(400).json({ message: "ChatId and title are required" });
  }

  try {
    const [chat]: any = await connection.query(findChatQuery, [id]);
    if (!chat.length) {
      return res.status(404).json({ message: "Chat not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }

  try {
    await connection.query(updateChatQuery, [title, id]);
    res.status(200).json({ message: "Chat updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
