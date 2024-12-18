import connection from "../settings/db.ts";
import { User } from "../types/index.ts";

export const findUserByEmail = async (email: string) => {
  const result = await connection.query(
    "SELECT * FROM Users WHERE email = ?;",
    [email]
  );

  if (Array.isArray(result) && result.length > 0) {
    const [rows]: any = result;
    return rows.length > 0 ? rows[0] : null;
  }

  return null;
};

export const findUserById = async (id: number) => {
  const [rows]: any = await connection.execute(
    "SELECT * FROM Users WHERE id = ?;",
    [id]
  );

  return rows[0];
};

export const updateUser = async (
  firstName: string,
  lastName: string,
  hash: string,
  email: string,
  id: number
) => {
  const result = await connection.query(
    `UPDATE Users SET firstName = ?, lastName = ?, password = ?, email = ? WHERE id = ?;`,
    [firstName, lastName, hash, email, id]
  );

  return result;
};

export const createUser = async (user: User) => {
  const [result] = await connection.query("INSERT INTO Users SET ?;", [user]);

  return result;
};
