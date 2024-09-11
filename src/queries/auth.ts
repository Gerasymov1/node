import connection from "../settings/db.ts";

export const insertRefreshToken = async (
  refreshToken: string,
  userId: number,
  refreshTokenExpiresAt: Date
) => {
  const [result] = await connection.query(
    `INSERT INTO RefreshTokens (token, userId, expiresAt) VALUES (?, ?, ?);`,
    [refreshToken, userId, refreshTokenExpiresAt]
  );

  return result;
};
