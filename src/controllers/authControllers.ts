import { Request, Response } from "express";
import connection from "../settings/db";
import {
  insertIntoUsers,
  selectFromUsersQueryEmail,
  setRefreshToken,
} from "../queries";
import { User } from "../types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../constants";
import { QueryResult } from "mysql2";
import logger from "../config/logger.ts";

type ExtendedQueryResult = {
  insertId: number;
} & QueryResult;

export const login = async (req: Request, res: Response) => {
  const { firstName, lastName, password, email } = req.body;

  if (!password || !email) {
    logger.info("Invalid request, fill in all fields");
    return res.badRequest("Invalid request, fill in all fields");
  }

  const [rows]: any = await connection.query(selectFromUsersQueryEmail, [
    email,
  ]);

  const user = rows[0] as User;

  if (!user) {
    logger.info("User not found");
    return res.notFound("User not found");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    logger.info("Invalid password or email");
    return res.unauthorized("Invalid password or email");
  }

  const accessToken = jwt.sign(
    { firstName, lastName, id: user.id, email },
    SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  const refreshTokenExpiresAt = new Date();

  refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7);

  const refreshToken = jwt.sign(
    { firstName, lastName, id: user.id, email },
    SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );

  const [result] = await connection.query(setRefreshToken, [
    refreshToken,
    user.id,
    refreshTokenExpiresAt,
  ]);

  if ((result as ExtendedQueryResult).insertId === 0) {
    logger.error("Error setting refresh token");
    return res.internalServerError("Error setting refresh token");
  }

  console.log("accessToken:", accessToken);
  console.log("refreshToken:", refreshToken);

  res
    .cookie("refreshToken", refreshToken)
    .cookie("accessToken", accessToken)
    .success({ user }, "Logged in");
};

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, password, email } = req.body;

  const [rows] = await connection.query(selectFromUsersQueryEmail, [email]);

  if ((rows as []).length > 0) {
    logger.info("User already exists");
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

  const [result] = await connection.query(insertIntoUsers, user);

  const accessToken = jwt.sign(
    {
      firstName,
      lastName,
      id: (result as ExtendedQueryResult).insertId,
      email,
    },
    SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  const refreshTokenExpiresAt = new Date();

  refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7);

  const refreshToken = jwt.sign(
    {
      firstName,
      lastName,
      id: (result as ExtendedQueryResult).insertId,
      email,
    },
    SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );

  const [refreshTokenResult] = await connection.execute(setRefreshToken, [
    refreshToken,
    (result as ExtendedQueryResult).insertId,
    refreshTokenExpiresAt,
  ]);

  if (!refreshTokenResult) {
    logger.error("Error setting refresh token");
    return res.internalServerError("Error setting refresh token");
  }

  console.log("accessToken:", accessToken);
  console.log("refreshToken:", refreshToken);

  res
    .cookie("refreshToken", refreshToken)
    .cookie("accessToken", accessToken)
    .created({ user }, "User created");
};
