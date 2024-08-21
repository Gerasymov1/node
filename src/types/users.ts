export type User = {
  id: number;
  username: string;
  displayName: string;
};

export type UserDB = {
  id: number;
  firstName: string;
  lastName: string;
  refreshToken: string;
};
