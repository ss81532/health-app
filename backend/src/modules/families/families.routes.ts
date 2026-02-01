import { Router } from "express";
import * as familyController from "./families.controller";

const router = Router();

router.post("/", familyController.createFamily);
router.get("/:id", familyController.getFamily);
router.get("/", familyController.getFamilies);

export default router;
