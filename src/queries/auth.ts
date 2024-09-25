import connection from "../settings/db.ts";

export const insertRefreshTokenByUser = async (
  refreshToken: string,
  userId: number,
  refreshTokenExpiresAt: Date
) => {
  const [result] = await connection.query(
    `INSERT INTO RefreshTokens (token, userId, expiresAt) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = VALUES(token), expiresAt = VALUES(expiresAt);`,
    [refreshToken, userId, refreshTokenExpiresAt]
  );

  return result;
};
