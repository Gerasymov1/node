import connection from "../settings/db.ts";

export const createMessagesTable = async () => {
  const checkIfTableExists = `SHOW TABLES LIKE 'Messages';`;

  const result = await connection.query(checkIfTableExists);

  if (!result) {
    console.error("Error checking if Messages table exists");
    return;
  }

  const query = `CREATE TABLE IF NOT EXISTS Messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    text TEXT NOT NULL,
    chatId INT NOT NULL,
    creatorId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    repliedMessageId INT,
    status TINYINT DEFAULT 1, -- 1 - active, 0 - deleted
    forwardedChatId INT,
    forwardedFromUserId INT,
    FOREIGN KEY (chatId) REFERENCES Chats(id) ON DELETE CASCADE,
    FOREIGN KEY (creatorId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (repliedMessageId) REFERENCES Messages(id) ON DELETE SET NULL,
    FOREIGN KEY (forwardedChatId) REFERENCES Chats(id) ON DELETE SET NULL,
    FOREIGN KEY (forwardedFromUserId) REFERENCES Users(id) ON DELETE SET NULL
  );`;

  try {
    await connection.query(query);
    console.log("Messages table created");
  } catch (error) {
    console.error(error);
  }
};
