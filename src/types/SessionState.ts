import type { AuthenticatedUser } from "./UserType";

export interface SessionState {
  token: string | null;
  user: AuthenticatedUser | null;
}
