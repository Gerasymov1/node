import connection from "../settings/db.ts";

export const createChatsTable = async () => {
  const checkIfTableExists = `SHOW TABLES LIKE 'Chats';`;

  const result = await connection.query(checkIfTableExists);

  if (!result) {
    console.error("Error checking if Chats table exists");
    return;
  }

  const query = `CREATE TABLE IF NOT EXISTS Chats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    creatorId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creatorId) REFERENCES Users(id) ON DELETE CASCADE
  );`;

  try {
    await connection.query(query);
    console.log("Chats table created");
  } catch (error) {
    console.error(error);
  }
};
