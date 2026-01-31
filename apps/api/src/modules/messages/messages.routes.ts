import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  ticketIdParamSchema,
  createMessageSchema,
} from "./messages.validation";
import * as c from "./messages.controller";

const router = Router({ mergeParams: true });

router.get("/", requireAuth, validate(ticketIdParamSchema), c.list);
router.post("/", requireAuth, validate(createMessageSchema), c.create);

export default router;
