import { env } from "./env";

export const COOKIE = {
  access: "access_token",
  refresh: "refresh_token",
} as const;

export function cookieOptions() {
  const isProd = env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
  };
}
