import { Router } from "express";
import { validate } from "../../middleware/validate";
import { registerSchema, loginSchema } from "./auth.validation";
import * as c from "./auth.comtroller";

const router = Router();

router.post("/register", validate(registerSchema), c.register);
router.post("/login", validate(loginSchema), c.login);
router.post("/refresh", c.refresh);
router.post("/logout", c.logout);
router.get("/me", ...c.me);

export default router;
