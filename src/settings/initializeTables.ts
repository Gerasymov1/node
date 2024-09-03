import { createUsersTable } from "../models/users.ts";
import { createChatsTable } from "../models/chats.ts";
import { createMessagesTable } from "../models/messages.ts";
import { createUsersChatsTable } from "../models/usersChats.ts";
import { createRefreshTokensTable } from "../models/refreshTokens.ts";

const initializeTables = async () => {
  await createUsersTable();
  await createChatsTable();
  await createMessagesTable();
  await createUsersChatsTable();
  await createRefreshTokensTable();
};

initializeTables()
  .then(() => {
    console.log("Tables initialized");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
