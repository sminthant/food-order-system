export type AccountRole = "user" | "admin";

export type PublicAccount = {
  id: string;
  name: string;
  email: string;
  role: AccountRole;
};
