import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env";

export type AccessPayload = {
  sub: string;
  role: "ADMIN" | "AGENT" | "CUSTOMER";
};

export function signAccessToken(payload: AccessPayload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: `${env.ACCESS_TOKEN_TTL_MIN}m`,
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload;
}

export function signRefreshToken(payload: AccessPayload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d`,
  });
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as AccessPayload;
}

export function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function refreshExpiryDate() {
  const d = new Date();
  d.setDate(d.getDate() + env.REFRESH_TOKEN_TTL_DAYS);
  return d;
}
