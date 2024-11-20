import connection from "../settings/db.ts";

export const up = async () => {
  const query = `ALTER TABLE Migrations DROP COLUMN createdAt;`;

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
