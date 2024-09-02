export const findChatQuery = `SELECT * FROM chats WHERE id = ?`;

export const insertChatQuery = `INSERT INTO chats (title, creatorId) VALUES (?, ?)`;

export const deleteChatQuery = `DELETE FROM chats WHERE id = ?`;

export const updateChatQuery = `UPDATE chats SET title = ? WHERE id = ?`;
