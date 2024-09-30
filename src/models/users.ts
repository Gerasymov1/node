import connection from "../settings/db";

export const createUsersTable = async () => {
  const checkIfTableExists = `SHOW TABLES LIKE 'Users';`;

  const result = await connection.query(checkIfTableExists);

  if (!result) {
    console.error("Error checking if Users table exists");
    return;
  }

  const query = `CREATE TABLE IF NOT EXISTS Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );`;

  try {
    await connection.query(query);
    console.log("Users table created");
  } catch (error) {
    console.error(error);
  }
};
