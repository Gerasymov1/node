import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../constants";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.header("Authorization")?.split(" ")[1] || "";
  const refreshToken = req.header("Cookie")?.split("=")[1] || "";

  if (!accessToken && !refreshToken) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decoded = jwt.verify(accessToken, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).send("Access Denied. No refresh token provided.");
    }

    return res.status(401).send("Unauthorized");
  }
};
