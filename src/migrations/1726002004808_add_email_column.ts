import connection from "../settings/db";

export const up = async () => {
  const sql = `ALTER TABLE Users ADD COLUMN email VARCHAR(255)`;

  const result = await connection.query(sql);

  if (result) {
    console.log("email column added to Users table successfully");
  }
};

export const down = async () => {
  // Write your migration here
};
