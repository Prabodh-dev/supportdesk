import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  createTicketSchema,
  listTicketsSchema,
  ticketIdSchema,
  updateStatusSchema,
  assignTicketSchema,
} from "./tickets.validation";
import * as c from "./tickets.controller";

const router = Router();

router.post(
  "/",
  requireAuth,
  requireRole("CUSTOMER", "ADMIN", "AGENT"),
  validate(createTicketSchema),
  c.create,
);
router.get("/", requireAuth, validate(listTicketsSchema), c.list);
router.get("/:id", requireAuth, validate(ticketIdSchema), c.getById);

router.patch(
  "/:id/status",
  requireAuth,
  requireRole("AGENT", "ADMIN"),
  validate(updateStatusSchema),
  c.setStatus,
);
router.patch(
  "/:id/assign",
  requireAuth,
  requireRole("AGENT", "ADMIN"),
  validate(assignTicketSchema),
  c.assign,
);

export default router;
