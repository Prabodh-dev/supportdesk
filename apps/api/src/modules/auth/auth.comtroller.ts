import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { cookieOptions, COOKIE } from "../../config/cookies";
import * as service from "./auth.service";
import { requireAuth } from "../../middleware/auth";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await service.registerCustomer(req.body);
  res.status(201).json({ user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.login({
    email: req.body.email,
    password: req.body.password,
    userAgent: req.get("user-agent") ?? undefined,
    ip: req.ip,
  });

  res.cookie(COOKIE.access, result.accessToken, {
    ...cookieOptions(),
    maxAge: 15 * 60 * 1000,
  });
  res.cookie(COOKIE.refresh, result.refreshToken, {
    ...cookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ user: result.user });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const rt = req.cookies?.[COOKIE.refresh];
  if (!rt) {
    const err: any = new Error("Unauthorized");
    err.statusCode = 401;
    throw err;
  }

  const rotated = await service.rotateRefreshToken(
    rt,
    req.get("user-agent") ?? undefined,
    req.ip,
  );

  res.cookie(COOKIE.access, rotated.accessToken, {
    ...cookieOptions(),
    maxAge: 15 * 60 * 1000,
  });
  res.cookie(COOKIE.refresh, rotated.refreshToken, {
    ...cookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ ok: true });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const rt = req.cookies?.[COOKIE.refresh];
  if (rt) await service.logout(rt);

  res.clearCookie(COOKIE.access, cookieOptions());
  res.clearCookie(COOKIE.refresh, cookieOptions());

  res.json({ ok: true });
});

export const me = [
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    res.json({ user: req.user });
  }),
];
