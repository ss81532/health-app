import { Router } from "express";
import { getMemberMedicalHistory, createMedicalHistory, deleteMedicalHistory } from "./medicalHistory.controller";


const router = Router();

router.get("/members/:memberId/history", getMemberMedicalHistory);
router.post("/members/:memberId/history", createMedicalHistory);
router.delete("/members/:memberId/history/:historyId", deleteMedicalHistory);

export default router;