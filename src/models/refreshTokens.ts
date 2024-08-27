import { db } from "../settings/db";

export const createRefreshTokensTable = async () => {
  const checkIfTableExists = `SHOW TABLES LIKE 'RefreshTokens';`;

  db.query(checkIfTableExists, (err, result) => {
    if (err) {
      console.error("Error checking if refresh tokens table exists: ", err);
      return;
    }

    if ((result as []).length > 0) {
      return;
    }

    console.log("Creating refresh tokens table");

    const query = `CREATE TABLE IF NOT EXISTS RefreshTokens (
              id INT AUTO_INCREMENT PRIMARY KEY,
              userId INT NOT NULL,
              token VARCHAR(255) NOT NULL,
              expiresAt DATETIME NOT NULL,
              createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
        );`;

    db.query(query, (err) => {
      if (err) {
        console.error("Error creating refresh tokens table: ", err);
        return;
      }

      console.log("Refresh tokens table created");
    });
  });
};
