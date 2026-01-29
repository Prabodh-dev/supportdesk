import type { Request, Response, NextFunction } from "express";
import { COOKIE } from "../config/cookies";
import { verifyAccessToken } from "../utils/tokens";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE.access];
  if (!token) {
    const err: any = new Error("Unauthorized");
    err.statusCode = 401;
    return next(err);
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    const err: any = new Error("Unauthorized");
    err.statusCode = 401;
    return next(err);
  }
}

export function requireRole(...roles: Array<"ADMIN" | "AGENT" | "CUSTOMER">) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      const err: any = new Error("Unauthorized");
      err.statusCode = 401;
      return next(err);
    }
    if (!roles.includes(req.user.role)) {
      const err: any = new Error("Forbidden");
      err.statusCode = 403;
      return next(err);
    }
    next();
  };
}
