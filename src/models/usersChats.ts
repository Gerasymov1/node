import connection from "../settings/db";

export const createUsersChatsTable = async () => {
  const checkIfTableExists = `SHOW TABLES LIKE 'UsersChats';`;

  const result = await connection.query(checkIfTableExists);

  if (!result) {
    console.error("Error checking if UsersChats table exists");
    return;
  }

  const query = `CREATE TABLE IF NOT EXISTS UsersChats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    chatId INT NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY (chatId) REFERENCES Chats(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    UNIQUE(chatId, userId)
  );`;

  try {
    await connection.query(query);
    console.log("UsersChats table created");
  } catch (error) {
    console.error(error);
  }
};
