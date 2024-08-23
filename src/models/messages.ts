import { db } from "../settings/db";

export const createMessagesTable = async () => {
  const checkIfTableExists = `SHOW TABLES LIKE 'Messages';`;

  db.query(checkIfTableExists, (err, result) => {
    if (err) {
      console.error("Error checking if messages table exists: ", err);
      return;
    }

    if ((result as []).length > 0) {
      return;
    }

    console.log("Creating messages table");

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

    db.query(query, (err) => {
      if (err) {
        console.error("Error creating messages table: ", err);
        return;
      }

      console.log("Messages table created");
    });
  });
};
