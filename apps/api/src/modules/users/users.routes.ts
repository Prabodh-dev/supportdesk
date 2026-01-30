import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { prisma } from "../../db/prisma";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get(
  "/",
  requireAuth,
  requireRole("ADMIN", "AGENT"),
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ users });
  }),
);

export default router;
