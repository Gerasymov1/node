import { db } from "../settings/db";

export const createChatsTable = async () => {
  const checkIfTableExists = `SHOW TABLES LIKE 'Chats';`;

  db.query(checkIfTableExists, (err, result) => {
    if (err) {
      console.error("Error checking if chats table exists: ", err);
      return;
    }

    if ((result as []).length > 0) {
      return;
    }

    console.log("Creating chats table");

    const query = `CREATE TABLE IF NOT EXISTS Chats (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        creatorId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (creatorId) REFERENCES Users(id) ON DELETE CASCADE
      );`;

    db.query(query, (err) => {
      if (err) {
        console.error("Error creating chats table: ", err);
        return;
      }

      console.log("Chats table created");
    });
  });
};
