import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

// type AuthSession = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

// type AuthUser = AuthSession["user"];

// export interface AuthenticatedRequest extends Request {
//   user: AuthUser;
//   session: AuthSession;
// }

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = session.user;
    req.session = session.session;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
