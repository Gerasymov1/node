import connection from "../settings/db.ts";

export const up = async () => {
  const query = `ALTER TABLE Migrations ADD COLUMN createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`;

  try {
    await connection.query(query);
    console.log("Migration table altered");
  } catch (error) {
    console.error(error);
  }
};

export const down = async () => {
  // Write your migration here
};
