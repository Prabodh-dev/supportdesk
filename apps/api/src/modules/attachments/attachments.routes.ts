import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  presignSchema,
  confirmSchema,
  downloadSchema,
} from "./attachments.validation";
import * as c from "./attachments.controller";

const router = Router();

router.post("/presign", requireAuth, validate(presignSchema), c.presign);
router.post("/confirm", requireAuth, validate(confirmSchema), c.confirm);
router.get("/:id/download", requireAuth, validate(downloadSchema), c.download);

export default router;
