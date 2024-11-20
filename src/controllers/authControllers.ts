import { Request, Response } from "express";
import { createUser, findUserByEmail } from "../queries/index.ts";
import bcrypt from "bcryptjs";
import { QueryResult } from "mysql2";
import logger from "../config/logger.ts";
import { User } from "../types/index.ts";
import { generateTokens } from "../middlewares/index.ts";

type ExtendedQueryResult = {
  insertId: number;
} & QueryResult;

export const login = async (req: Request, res: Response) => {
  const { password, email } = req.body;

  try {
    if (!password || !email) {
      logger
        .child({
          childData: {
            email,
          },
        })
        .info("Invalid request, fill in all fields");
      return res.badRequest("Invalid request, fill in all fields");
    }

    const user = await findUserByEmail(email);

    if (!user) {
      logger
        .child({
          childData: {
            email,
          },
        })
        .info("User not found");
      return res.notFound("User not found");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      logger
        .child({
          childData: {
            email,
          },
        })
        .info("Invalid password or email");
      return res.unauthorized("Invalid password or email");
    }

    const { accessToken, refreshToken } = await generateTokens(user.id);

    if (!accessToken || !refreshToken) {
      logger
        .child({
          childData: {
            email,
          },
        })
        .error("Error setting refresh token");
      return res.internalServerError("Error setting refresh token");
    }

    res
      .cookie("refreshToken", refreshToken)
      .cookie("accessToken", accessToken)
      .success(
        { user: { firstName: user.firstName, lastName: user.lastName, email } },
        "Logged in"
      );
  } catch (error) {
    logger
      .child({
        childData: {
          email,
        },
      })
      .error("Error logging in");

    console.error("Error logging in", error);

    return res.internalServerError("Error logging in");
  }
};

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, password, email } = req.body;

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

    const searchedUser = await findUserByEmail(email);

    if (searchedUser) {
      logger
        .child({
          childData: {
            email,
          },
        })
        .info("User already exists");
      return res.conflict("User already exists");
    }

    const saltRounds = 10;

    const hash = await bcrypt.hash(password, saltRounds);

    const user = {
      firstName,
      lastName,
      password: hash,
      email,
    };

    const result = await createUser(user as User);

    if ((result as ExtendedQueryResult).insertId === 0) {
      logger
        .child({
          childData: {
            email,
          },
        })
        .error("Error creating user");
      return res.internalServerError("Error creating user");
    }

    res.created({ user: { firstName, lastName, email } }, "User created");
  } catch (error) {
    logger
      .child({
        childData: {
          email,
        },
      })
      .error("Error creating user");

    console.error("Error creating user", error);

    return res.internalServerError("Error creating user");
  }
};
