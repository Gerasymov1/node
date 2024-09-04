export const selectFromUsersQueryFirstAndLastName =
  "SELECT * FROM Users WHERE firstName = ? AND lastName = ?;";

export const selectFromUsersQueryId = "SELECT * FROM Users WHERE id = ?;";

export const updateUserQuery = `UPDATE Users SET firstName = ?, lastName = ?, password = ? WHERE id = ?;`;

export const insertIntoUsers = "INSERT INTO Users SET ?;";
