import { NextFunction, Request, Response } from "express";
import { MOCKED_USERS } from "../constants";

export const handleIndexByUserId = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const {
    params: { id },
  } = request;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return response.sendStatus(400);
  }

  const userIndex = MOCKED_USERS.findIndex((user) => user.id === parsedId);

  if (userIndex === -1) {
    return response.sendStatus(404);
  }

  request.userIndex = userIndex;

  next();
};
