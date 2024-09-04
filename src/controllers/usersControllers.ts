import connection from "../settings/db";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { selectFromUsersQueryId, updateUserQuery } from "../queries";

export const updateUser = async (req: Request, res: Response) => {
  const { firstName, lastName, password, id } = req.body;

  if (!firstName || !lastName || !password) {
    return res.status(400).send("Invalid request, fill in all fields");
  }

  const [rows] = await connection.execute(selectFromUsersQueryId, [id]);

  if ((rows as []).length === 0) {
    return res.status(404).send("User not found");
  }

  const saltRounds = 10;

  const hash = await bcrypt.hash(password, saltRounds);

  await connection.query(updateUserQuery, [firstName, lastName, hash, id]);

  res.status(204).send();
};
