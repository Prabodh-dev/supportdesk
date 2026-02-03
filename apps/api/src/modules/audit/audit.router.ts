import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { prisma } from "../../db/prisma";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const page = Math.max(1, Number(req.query.page ?? 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 20)));
    const skip = (page - 1) * limit;

    const [total, items] = await prisma.$transaction([
      prisma.auditLog.count(),
      prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          action: true,
          createdAt: true,
          meta: true,
          actor: { select: { id: true, email: true, role: true } },
          ticket: { select: { id: true, ticketNo: true } },
        },
      }),
    ]);

    res.json({
      meta: { page, limit, total, hasMore: skip + items.length < total },
      items,
    });
  }),
);

export default router;
