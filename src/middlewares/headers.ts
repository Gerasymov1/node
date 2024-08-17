import { Request, Response, NextFunction } from "express";

export const handleSetHeaders = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, DELETE"
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.setHeader("Content-Type", "application/json");

  next();
};
