import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import ticketsRoutes from "../modules/tickets/tickets.routes";
import teamsRoutes from "../modules/teams/teams.routes";
import usersRoutes from "../modules/users/users.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "helpdesk-api" });
});

router.use("/auth", authRoutes);
router.use("/tickets", ticketsRoutes);
router.use("/teams", teamsRoutes);
router.use("/users", usersRoutes);

export default router;
