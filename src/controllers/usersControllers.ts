import connection from "../settings/db";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { selectFromUsersQueryId, updateUserQuery } from "../queries";
import logger from "../config/logger.ts";

export const updateUser = async (req: Request, res: Response) => {
  const { firstName, lastName, password } = req.body;
  const id = req.user?.id;

  if (!firstName || !lastName || !password) {
    logger.info("Invalid request, fill in all fields");
    return res.status(400).send("Invalid request, fill in all fields");
  }

  const [rows] = await connection.execute(selectFromUsersQueryId, [id]);

  if ((rows as []).length === 0) {
    logger.info("User not found");
    return res.status(404).send("User not found");
  }

  const saltRounds = 10;

  const hash = await bcrypt.hash(password, saltRounds);

  await connection.query(updateUserQuery, [firstName, lastName, hash, id]);

  res.status(204).send();
};
