import { User } from "./users.ts";

declare global {
  namespace Express {
    interface Request {
      user: Omit<User, "password">;
      query: {
        page: string;
        limit: string;
        search: string;
      };
    }
    interface Response {
      permissionDenied: (message: string) => void;
      badRequest: (message: string) => void;
      success: (data: any, message: string) => void;
      unauthorized: (message: string) => void;
      notFound: (message: string) => void;
      internalServerError: (message: string) => void;
      conflict: (message: string) => void;
      created: (data: any, message: string) => void;
    }
  }
}
