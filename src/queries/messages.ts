import connection from "../settings/db.ts";

export const createMessage = async (
  chatId: number,
  text: string,
  creatorId: number
) => {
  const [result] = await connection.query(
    "INSERT INTO Messages (chatId, text, creatorId) VALUES (?, ?, ?)",
    [chatId, text, creatorId]
  );

  return result;
};

export const getMessagesByChatId = async (
  chatId: number,
  creatorId: number
) => {
  const [result] = await connection.query(
    "SELECT * FROM Messages WHERE chatId = ? AND creatorId = ?",
    [chatId, creatorId]
  );

  return result;
};

export const deleteMessage = async (
  chatId: number,
  id: number,
  creatorId: number
) => {
  const [result] = await connection.query(
    "DELETE FROM Messages WHERE chatId = ? AND id = ? AND creatorId = ?",
    [chatId, id, creatorId]
  );

  return result;
};

export const editMessage = async (
  chatId: number,
  id: number,
  text: string,
  creatorId: number
) => {
  const [result] = await connection.query(
    "UPDATE Messages SET text = ? WHERE chatId = ? AND id = ? AND creatorId = ?",
    [text, chatId, id, creatorId]
  );

  return result;
};

export const getMessageById = async (id: number) => {
  const [result] = await connection.query(
    "SELECT * FROM Messages WHERE id = ?",
    [id]
  );

  return result;
};

export const forwardMessage = async (
  text: string,
  chatId: number,
  creatorId: number,
  repliedMessageId: number,
  forwardedChatId: number,
  forwardedFromUserId: number
) => {
  const [result] = await connection.query(
    "INSERT INTO Messages (text, chatId, creatorId, repliedMessageId, forwardedChatId, forwardedFromUserId) VALUES (?, ?, ?, ?, ?, ?)",
    [
      text,
      chatId,
      creatorId,
      repliedMessageId,
      forwardedChatId,
      forwardedFromUserId,
    ]
  );

  return result;
};
