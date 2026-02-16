import { Router } from "express";
import * as familyController from "./families.controller";

const router = Router();

router.post("/", familyController.createFamily);
router.get("/:id", familyController.getFamily);
router.get("/", familyController.getFamilies);
router.get("/:id/medications/active",familyController.getActiveFamilyMedications);
export default router;
