import { Request, Response } from "express";
import connection from "../settings/db";
import { selectFromUsersQueryFirstAndLastName } from "../queries";
import { User } from "../types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../constants";
import { QueryResult } from "mysql2";

type ExtendedQueryResult = {
  insertId: number;
} & QueryResult;

export const login = async (req: Request, res: Response) => {
  const { firstName, lastName, password } = req.body;

  if (!firstName || !lastName || !password) {
    return res.status(400).send("Invalid request, fill in all fields");
  }

  const [rows]: any = await connection.query(
    selectFromUsersQueryFirstAndLastName,
    [firstName, lastName]
  );

  const user = rows[0] as User;

  if (!user) {
    return res.status(404).send("User not found");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).send("Invalid password or first name/last name");
  }

  const accessToken = jwt.sign({ firstName, lastName }, SECRET_KEY, {
    expiresIn: "1h",
  });

  const refreshTokenExpiresAt = new Date();

  refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7);

  const refreshToken = jwt.sign({ firstName, lastName }, SECRET_KEY, {
    expiresIn: "7d",
  });

  const setRefreshToken = `INSERT INTO RefreshTokens (token, userId, expiresAt) VALUES (?, ?, ?);`;

  const [result] = await connection.query(setRefreshToken, [
    refreshToken,
    user.id,
    refreshTokenExpiresAt,
  ]);

  if ((result as ExtendedQueryResult).insertId === 0) {
    return res.status(500).send("Error setting refresh token");
  }

  console.log("accessToken:", accessToken);
  console.log("refreshToken:", refreshToken);

  res
    .cookie("refreshToken", refreshToken)
    .cookie("accessToken", accessToken)
    .status(201)
    .send(user);
};

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, password } = req.body;

  const [rows] = await connection.query(selectFromUsersQueryFirstAndLastName, [
    firstName,
    lastName,
  ]);

  if ((rows as []).length > 0) {
    return res.status(409).send("User already exists");
  }

  const saltRounds = 10;

  const hash = await bcrypt.hash(password, saltRounds);

  const user = {
    firstName,
    lastName,
    password: hash,
  };

  const query = "INSERT INTO Users SET ?;";

  const [result] = await connection.query(query, user);

  const accessToken = jwt.sign({ firstName, lastName }, SECRET_KEY, {
    expiresIn: "1h",
  });

  const refreshTokenExpiresAt = new Date();

  refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7);

  const refreshToken = jwt.sign({ firstName, lastName }, SECRET_KEY, {
    expiresIn: "7d",
  });

  const setRefreshToken = `INSERT INTO RefreshTokens (token, userId, expiresAt) VALUES (?, ?, ?);`;

  const [refreshTokenResult] = await connection.execute(setRefreshToken, [
    refreshToken,
    (result as ExtendedQueryResult).insertId,
    refreshTokenExpiresAt,
  ]);

  if (!refreshTokenResult) {
    return res.status(500).send("Error setting refresh token");
  }

  console.log("accessToken:", accessToken);
  console.log("refreshToken:", refreshToken);

  res
    .cookie("refreshToken", refreshToken)
    .cookie("accessToken", accessToken)
    .status(201)
    .send(user);
};
