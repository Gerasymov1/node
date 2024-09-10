export const selectFromUsersQueryEmail = "SELECT * FROM Users WHERE email = ?;";

export const selectFromUsersQueryId = "SELECT * FROM Users WHERE id = ?;";

export const updateUserQuery = `UPDATE Users SET firstName = ?, lastName = ?, password = ?, email = ? WHERE id = ?;`;

export const insertIntoUsers = "INSERT INTO Users SET ?;";
