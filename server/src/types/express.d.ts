import { auth } from "../lib/auth.js";

type SessionResponse = Awaited<ReturnType<typeof auth.api.getSession>>;

type AuthUser = NonNullable<SessionResponse>["user"];
type AuthSession = NonNullable<SessionResponse>["session"];

declare global {
  namespace Express {
    interface Request {
      user: AuthUser;
      session: AuthSession;
    }
  }
}
