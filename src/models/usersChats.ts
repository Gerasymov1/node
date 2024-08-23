import { db } from "../settings/db";

export const createUsersChatsTable = async () => {
  const checkIfTableExists = `SHOW TABLES LIKE 'UsersChats';`;

  db.query(checkIfTableExists, (err, result) => {
    if (err) {
      console.error("Error checking if usersChats table exists: ", err);
      return;
    }

    if ((result as []).length > 0) {
      return;
    }

    console.log("Creating usersChats table");

    const query = `CREATE TABLE IF NOT EXISTS UsersChats (
       id INT PRIMARY KEY AUTO_INCREMENT,
       chatId INT NOT NULL,
       userId INT NOT NULL,
       FOREIGN KEY (chatId) REFERENCES Chats(id) ON DELETE CASCADE,
       FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
       UNIQUE(chatId, userId)
    );`;

    db.query(query, (err) => {
      if (err) {
        console.error("Error creating usersChats table: ", err);
        return;
      }

      console.log("UsersChats table created");
    });
  });
};
