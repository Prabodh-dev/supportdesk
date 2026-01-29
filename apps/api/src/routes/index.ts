import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "helpdesk-api" });
});

router.use("/auth", authRoutes);

export default router;
