import { NextFunction, Request, Response } from "express";

export const responseMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.permissionDenied = (message = "Permission denied") => {
    return res.status(403).json({
      success: false,
      message: message,
    });
  };

  res.badRequest = (message = "Bad request") => {
    return res.status(400).json({
      success: false,
      message: message,
    });
  };

  res.success = (data = {}, message = "Success") => {
    return res.status(200).json({
      success: true,
      message: message,
      data: data,
    });
  };

  res.unauthorized = (message = "Unauthorized") => {
    return res.status(401).json({
      success: false,
      message: message,
    });
  };

  res.notFound = (message = "Not found") => {
    return res.status(404).json({
      success: false,
      message: message,
    });
  };

  res.internalServerError = (message = "Internal server error") => {
    return res.status(500).json({
      success: false,
      message: message,
    });
  };

  res.conflict = (message = "Conflict") => {
    return res.status(409).json({
      success: false,
      message: message,
    });
  };

  res.created = (data = {}, message = "Created") => {
    return res.status(201).json({
      success: true,
      message: message,
      data: data,
    });
  };

  next();
};
