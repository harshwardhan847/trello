export type User = {
  id: string;
  name: string | null;
  email: string;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};
