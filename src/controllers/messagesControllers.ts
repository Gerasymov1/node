import { Request, Response } from "express";
import logger from "../config/logger.ts";
import {
  createMessage as createMessageQuery,
  getMessagesByChatId as getMessagesByChatIdQuery,
  deleteMessage as deleteMessageQuery,
  editMessage as editMessageQuery,
} from "../queries/messages.ts";

export const createMessage = async (req: Request, res: Response) => {
  const { text } = req.body;
  const { chatId } = req.params;
  const creatorId = req.user?.id;

  if (!chatId || !text || !creatorId) {
    logger.child({
      childData: {
        chatId,
        text,
        creatorId,
      },
    });

    return res.badRequest("ChatId, text and creatorId are required");
  }

  try {
    await createMessageQuery(Number(chatId), text, creatorId);
    res.created({ chatId, text }, "Message created");
  } catch (error) {
    res.internalServerError("Server error");
  }
};

export const getMessagesByChatId = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const creatorId = req.user?.id;

  if (!chatId) {
    logger.child({
      childData: {
        chatId,
        creatorId,
      },
    });

    return res.badRequest("ChatId is required");
  }

  try {
    const messages = await getMessagesByChatIdQuery(Number(chatId), creatorId);

    res.success({ messages }, "Messages retrieved");
  } catch (error) {
    res.internalServerError("Server error");
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  const { chatId, id } = req.params;
  const creatorId = req.user?.id;

  if (!chatId || !id) {
    logger.child({
      childData: {
        chatId,
        id,
        creatorId,
      },
    });

    return res.badRequest("ChatId and id are required");
  }

  try {
    const result = await deleteMessageQuery(
      Number(chatId),
      Number(id),
      creatorId
    );

    if ((result as any).affectedRows === 0) {
      return res.notFound("Message not found");
    }

    res.success({}, "Message deleted");
  } catch (error) {
    res.internalServerError("Server error");
  }
};

export const editMessage = async (req: Request, res: Response) => {
  const { chatId, id } = req.params;
  const { text } = req.body;
  const creatorId = req.user?.id;

  if (!chatId || !id || !text) {
    logger.child({
      childData: {
        chatId,
        id,
        text,
        creatorId,
      },
    });

    return res.badRequest("ChatId, id and text are required");
  }

  try {
    const result = await editMessageQuery(
      Number(chatId),
      Number(id),
      text,
      creatorId
    );

    if ((result as any).affectedRows === 0) {
      return res.notFound("Message not found");
    }

    res.success({}, "Message edited");
  } catch (error) {
    res.internalServerError("Server error");
  }
};
