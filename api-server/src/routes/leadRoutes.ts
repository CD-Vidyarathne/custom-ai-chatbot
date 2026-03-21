import { Router } from "express";
import { leadController } from "../controllers/leadController.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", leadController.create);

router.get("/", requireAuth, leadController.list);

export default router;
