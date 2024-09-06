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
  }
}
