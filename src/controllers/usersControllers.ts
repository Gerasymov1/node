import connection from "../settings/db";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { selectFromUsersQueryId, updateUserQuery } from "../queries";
import logger from "../config/logger.ts";

export const updateUser = async (req: Request, res: Response) => {
  const { firstName, lastName, password, email } = req.body;
  const id = req.user?.id;

  if (!firstName || !lastName || !password || !email) {
    logger.info("Invalid request, fill in all fields");
    return res.badRequest("Invalid request, fill in all fields");
  }

  const [rows] = await connection.execute(selectFromUsersQueryId, [id]);

  if ((rows as []).length === 0) {
    logger.info("User not found");
    return res.notFound("User not found");
  }

  const saltRounds = 10;

  const hash = await bcrypt.hash(password, saltRounds);

  await connection.query(updateUserQuery, [
    firstName,
    lastName,
    hash,
    email,
    id,
  ]);

  res.status(204).send();
};
