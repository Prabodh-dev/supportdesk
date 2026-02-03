import { prisma } from "../../db/prisma";
import { hashPassword, verifyPassword } from "../../utils/password";
import {
  signAccessToken,
  signRefreshToken,
  sha256,
  refreshExpiryDate,
} from "../../utils/token";

export async function registerCustomer(input: {
  email: string;
  password: string;
  name?: string;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing) {
    const err: any = new Error("Email already in use");
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash,
      role: "CUSTOMER",
    },
    select: { id: true, email: true, name: true, role: true },
  });

  return user;
}

export async function login(input: {
  email: string;
  password: string;
  userAgent?: string;
  ip?: string;
}) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !user.isActive) {
    const err: any = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const ok = await verifyPassword(input.password, user.passwordHash);
  if (!ok) {
    const err: any = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const payload = { sub: user.id, role: user.role as any };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshTokenHash: sha256(refreshToken),
      expiresAt: refreshExpiryDate(),
      userAgent: input.userAgent,
      ip: input.ip,
    },
  });

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    accessToken,
    refreshToken,
  };
}

export async function rotateRefreshToken(
  oldRefreshToken: string,
  userAgent?: string,
  ip?: string,
) {
  const oldHash = sha256(oldRefreshToken);
  const session = await prisma.session.findUnique({
    where: { refreshTokenHash: oldHash },
    include: { user: true },
  });

  if (
    !session ||
    session.revokedAt ||
    session.expiresAt < new Date() ||
    !session.user.isActive
  ) {
    const err: any = new Error("Unauthorized");
    err.statusCode = 401;
    throw err;
  }

  const payload = { sub: session.userId, role: session.user.role as any };
  const newAccessToken = signAccessToken(payload);
  const newRefreshToken = signRefreshToken(payload);

  await prisma.session.update({
    where: { refreshTokenHash: oldHash },
    data: {
      refreshTokenHash: sha256(newRefreshToken),
      expiresAt: refreshExpiryDate(),
      userAgent,
      ip,
    },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logout(refreshToken: string) {
  const hash = sha256(refreshToken);
  await prisma.session.updateMany({
    where: { refreshTokenHash: hash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
