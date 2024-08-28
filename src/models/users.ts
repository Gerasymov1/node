import { db } from "../settings/db";

export const createUsersTable = async () => {
  const checkIfTableExists = `SHOW TABLES LIKE 'Users';`;

  db.query(checkIfTableExists, (err, result) => {
    if (err) {
      console.error("Error checking if users table exists: ", err);
      return;
    }

    if ((result as []).length > 0) {
      return;
    }

    console.log("Creating users table");

    const query = `CREATE TABLE IF NOT EXISTS Users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );`;

    db.query(query, (err) => {
      if (err) {
        console.error("Error creating users table: ", err);
        return;
      }

      console.log("Users table created");
    });
  });
};
