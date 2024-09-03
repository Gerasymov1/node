import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../constants";
import { User } from "../types";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decoded = jwt.verify(accessToken, SECRET_KEY) as Omit<
      User,
      "password | id"
    >;

    console.log(decoded);

    req.user = {
      firstName: decoded.firstName,
      lastName: decoded.lastName,
    };

    next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).send("Access Denied. No refresh token provided.");
    }

    return res.status(401).send("Unauthorized");
  }
};
