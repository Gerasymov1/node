import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../constants";
import { User } from "../types";
import { findUserById, insertRefreshTokenByUser } from "../queries";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  try {
    if (!accessToken?.length && !refreshToken?.length) {
      return res.unauthorized("Unauthorized");
    }

    const decoded = jwt.verify(accessToken, SECRET_KEY) as Omit<
      User,
      "password"
    >;

    const user = await findUserById(decoded.id);

    if (!user) {
      return res.permissionDenied("Permission denied");
    }

    req.user = {
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    if (!refreshToken) {
      return res.permissionDenied("Permission denied");
    }

    return res.unauthorized("Unauthorized");
  }
};

export const generateTokens = async (userId: number) => {
  try {
    const user = await findUserById(userId);

    if (!user) {
      return { accessToken: null, refreshToken: null };
    }

    const accessToken = jwt.sign(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id,
        email: user.email,
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
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id,
        email: user.email,
      },
      SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    const findRefreshToken = await insertRefreshTokenByUser(
      refreshToken,
      userId,
      refreshTokenExpiresAt
    );

    if (!findRefreshToken) {
      return { accessToken: null, refreshToken: null };
    }

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
