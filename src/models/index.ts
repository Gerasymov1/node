import { createUsersTable } from "./users";
import { createChatsTable } from "./chats";
import { createUsersChatsTable } from "./usersChats";
import { createMessagesTable } from "./messages";
import { createRefreshTokensTable } from "./refreshTokens";

export const initializeTables = async () => {
  await createUsersTable();
  await createChatsTable();
  await createUsersChatsTable();
  await createMessagesTable();
  await createRefreshTokensTable();
};
