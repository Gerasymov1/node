import connection from "../settings/db.ts";

export const createRefreshTokensTable = async () => {
  const checkIfTableExists = `SHOW TABLES LIKE 'RefreshTokens';`;

  const result = await connection.query(checkIfTableExists);

  if (!result) {
    console.error("Error checking if RefreshTokens table exists");
    return;
  }

  const query = `CREATE TABLE IF NOT EXISTS RefreshTokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expiresAt DATETIME NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
  );`;

  try {
    await connection.query(query);
    console.log("RefreshTokens table created");
  } catch (error) {
    console.error(error);
  }
};
