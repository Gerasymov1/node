import { Request, Response } from "express";
import logger from "../config/logger.ts";
import {
  createMessage as createMessageQuery,
  getMessagesByChatId as getMessagesByChatIdQuery,
  deleteMessage as deleteMessageQuery,
  editMessage as editMessageQuery,
  getMessageById as getMessageByIdQuery,
  forwardMessage as forwardMessageQuery,
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
    logger
      .child({
        childData: {
          chatId,
          text,
          creatorId,
          error,
        },
      })
      .error(error);

    console.error("Error creating message:", error);

    res.internalServerError("Server error");
  }
};

export const getMessagesByChatId = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const creatorId = req.user?.id;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";

  if (!chatId) {
    logger.child({
      childData: {
        chatId,
        creatorId,
      },
    });

    return res.badRequest("ChatId is required");
  }

  const offset = (page - 1) * limit;
  const searchPattern = `%${search}%`;

  try {
    const messages = await getMessagesByChatIdQuery(
      Number(chatId),
      creatorId,
      searchPattern,
      limit,
      offset
    );

    res.success({ messages }, "Messages retrieved");
  } catch (error) {
    logger
      .child({
        childData: {
          chatId,
          creatorId,
          error,
        },
      })
      .error(error);

    console.error("Error getting messages by chatId:", error);

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
    logger
      .child({
        childData: {
          chatId,
          id,
          creatorId,
          error,
        },
      })
      .error(error);

    console.error("Error deleting message:", error);

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
    logger
      .child({
        childData: {
          chatId,
          id,
          text,
          creatorId,
          error,
        },
      })
      .error(error);

    console.error("Error editing message:", error);

    res.internalServerError("Server error");
  }
};

export const forwardMessage = async (req: Request, res: Response) => {
  const { chatId, id: repliedMessageId } = req.params;
  const creatorId = req.user?.id;

  if (!chatId) {
    logger.child({
      childData: {
        chatId,
        creatorId,
      },
    });

    return res.badRequest("ChatId, text and creatorId are required");
  }

  try {
    const message: any = await getMessageByIdQuery(Number(repliedMessageId));

    if (!message.length) {
      return res.notFound("Message not found");
    }

    const repliedMessage = message[0];

    const result = await forwardMessageQuery(
      repliedMessage.text,
      Number(chatId),
      creatorId,
      Number(repliedMessageId),
      repliedMessage.chatId,
      repliedMessage.creatorId
    );

    if ((result as any).affectedRows === 0) {
      return res.notFound("Message has not been forwarded");
    }

    res.created({ chatId, text: repliedMessage.text }, "Message forwarded");
  } catch (error) {
    logger
      .child({
        childData: {
          chatId,
          repliedMessageId,
          creatorId,
          error,
        },
      })
      .error(error);

    console.error("Error forwarding message:", error);

    res.internalServerError("Server error");
  }
};
