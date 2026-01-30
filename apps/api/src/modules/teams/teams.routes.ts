import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { createTeamSchema, addMemberSchema } from "./teams.validation";
import * as c from "./teams.controller";

const router = Router();

router.get("/", requireAuth, c.list);
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  validate(createTeamSchema),
  c.create,
);
router.post(
  "/:id/members",
  requireAuth,
  requireRole("ADMIN"),
  validate(addMemberSchema),
  c.addMember,
);

export default router;
