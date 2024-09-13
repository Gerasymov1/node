import connection from "../settings/db.ts";

export const deleteChat = async (id: number) => {
  const [chat]: any = await connection.query(`DELETE FROM chats WHERE id = ?`, [
    id,
  ]);

  return chat[0];
};

export const findChat = async (id: number) => {
  const [chat]: any = await connection.query(
    `SELECT * FROM chats WHERE id = ?`,
    [id]
  );

  return chat[0];
};

export const updateChat = async (title: string, id: number) => {
  const result = await connection.query(
    `UPDATE chats SET title = ? WHERE id = ?`,
    [title, id]
  );

  return result;
};

export const createChat = async (title: string, creatorId: number) => {
  const [result] = await connection.query(
    `INSERT INTO chats (title, creatorId) VALUES (?, ?)`,
    [title, creatorId]
  );

  return result;
};

export const getChats = async (
  creatorId: number,
  search: string,
  limit: number,
  offset: number
) => {
  const query = `
    SELECT * FROM chats
    WHERE creatorId = ? AND (title LIKE ?)
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?;
  `;

  const searchPattern = `%${search}%`;

  const [chats]: any = await connection.query(query, [
    creatorId,
    searchPattern,
    limit,
    offset,
  ]);

  return chats;
};
