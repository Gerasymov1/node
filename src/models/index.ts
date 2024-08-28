import { createUsersTable } from "./users";
import { createChatsTable } from "./chats";
import { createUsersChatsTable } from "./usersChats";
import { createMessagesTable } from "./messages";
import { createRefreshTokensTable } from "./refreshTokens";

const initializeTables = async () => {
  await createUsersTable();
  await createChatsTable();
  await createUsersChatsTable();
  await createMessagesTable();
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
