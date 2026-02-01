import { Router } from "express";
import * as medicationController from "./medication.controller";

const router = Router({ mergeParams: true }); // mergeParams needed to access memberId from parent

// Create a new medication for a member
router.post("/", medicationController.createMedication);

// Get all medications for a member
router.get("/", medicationController.getMedications);

// Get active medications only
router.get("/active", medicationController.getActiveMedications);

// Update a medication
router.put("/:id", medicationController.updateMedication);

// Delete a medication
router.delete("/:id", medicationController.deleteMedication);

export default router;
