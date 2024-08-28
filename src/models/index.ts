import { createUsersTable } from "./users";
import { createChatsTable } from "./chats";
import { createUsersChatsTable } from "./usersChats";
import { createMessagesTable } from "./messages";

export const initializeTables = async () => {
  await createUsersTable();
  await createChatsTable();
  await createUsersChatsTable();
  await createMessagesTable();
};
