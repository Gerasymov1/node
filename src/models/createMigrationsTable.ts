import connection from "../settings/db";

export const createMigrationsTable = async () => {
  const checkIfTableExists = `SHOW TABLES LIKE 'Migrations';`;

  const result = await connection.query(checkIfTableExists);

  if (!result) {
    console.error("Error checking if Migrations table exists");
    return;
  }

  const query = `CREATE TABLE IF NOT EXISTS Migrations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        executedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

  try {
    await connection.query(query);
    console.log("Migrations table created");
  } catch (error) {
    console.error(error);
  }
};
