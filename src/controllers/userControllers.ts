import { db } from "../settings/db";
import { UserDB } from "../types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../constants";
import { Request, Response } from "express";
import { QueryResult } from "mysql2";

type ExtendedQueryResult = {
  insertId: number;
} & QueryResult;

export const login = async (req: Request, res: Response) => {
  const { firstName, lastName, password } = req.body;

  if (!firstName || !lastName || !password) {
    return res.status(400).send("Invalid request, fill in all fields");
  }

  const query = "SELECT * FROM Users WHERE firstName = ? AND lastName = ?;";

  db.query(query, [firstName, lastName], (err, result) => {
    if (err) {
      return res.status(500).send("Error checking if user exists");
    }

    if ((result as []).length === 0) {
      return res.status(404).send("User not found");
    }

    const user = (result as [UserDB])[0];

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).send("Error comparing passwords");
      }

      if (!result) {
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

      db.query(
        setRefreshToken,
        [refreshToken, user.id, refreshTokenExpiresAt],
        (err, result) => {
          if (err) {
            return res.status(500).send("Error setting refresh token");
          }

          console.log("accessToken:", accessToken);
          console.log("refreshToken:", refreshToken);

          res
            .cookie("refreshToken", refreshToken)
            .cookie("accessToken", accessToken)
            .status(201)
            .send(user);
        }
      );
    });
  });
};

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, password } = req.body;

  const checkIfUserExistsFirstNameAndLastName = `SELECT * FROM Users WHERE firstName = ? AND lastName = ?;`;

  db.query(
    checkIfUserExistsFirstNameAndLastName,
    [firstName, lastName],
    (err, result) => {
      if (err) {
        return res.status(500).send("Error checking if user exists");
      }

      if ((result as []).length > 0) {
        return res.status(409).send("User already exists");
      }

      const saltRounds = 10;

      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          return res.status(500).send("Error hashing password");
        }

        const user = {
          firstName,
          lastName,
          password: hash,
        };

        const query = "INSERT INTO Users SET ?;";

        db.query(query, user, (err, result: ExtendedQueryResult) => {
          if (err) {
            return res.status(500).send("Error inserting user");
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

          db.query(
            setRefreshToken,
            [refreshToken, result.insertId, refreshTokenExpiresAt],
            (err, result) => {
              if (err) {
                return res.status(500).send("Error setting refresh token");
              }

              console.log("accessToken:", accessToken);
              console.log("refreshToken:", refreshToken);

              res
                .cookie("refreshToken", refreshToken)
                .cookie("accessToken", accessToken)
                .status(201)
                .send(user);
            }
          );
        });
      });
    }
  );
};
