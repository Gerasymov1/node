import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import {
  findUserById,
  updateUser as updateUserQuery,
} from "../queries/index.ts";
import logger from "../config/logger.ts";

export const updateUser = async (req: Request, res: Response) => {
  const { firstName, lastName, password, email } = req.body;
  const id = req.user?.id;

  try {
    if (!firstName || !lastName || !password || !email) {
      logger
        .child({
          childData: {
            email,
          },
        })
        .info("Invalid request, fill in all fields");
      return res.badRequest("Invalid request, fill in all fields");
    }

    const result = await findUserById(id);

    if (!result) {
      logger
        .child({
          childData: {
            email,
          },
        })
        .info("User not found");
      return res.notFound("User not found");
    }

    const saltRounds = 10;

    const hash = await bcrypt.hash(password, saltRounds);

    await updateUserQuery(firstName, lastName, hash, email, id);

    res.status(204).send();
  } catch (error) {
    logger
      .child({
        childData: {
          email,
        },
      })
      .error("Error updating user", error);

    console.error("Error updating user", error);

    return res.internalServerError("Error updating user");
  }
};
