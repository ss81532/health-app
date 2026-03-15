import { Router } from "express";
import familiesRoutes from "../modules/families/families.routes";
import familyMembersRoutes from "../modules/familyMembers/familyMembers.routes";
import familyRelationshipsRoutes from "../modules/familyRelationship/familyRelationships.routes";
import medicationRoutes from "../modules/Medication/medication.routes";
import medicalDocumentsRoutes from "../modules/medicalDocuments/medicalDocuments.routes";
import memberRoutes from "../modules/members/members.routes";
import appointmentsRoutes from "../modules/appointments/appointment.routes";
import medicalRecordsRoutes from "../modules/medicalHistory/medicalHistory.routes";
const router = Router();

router.use("/families", familiesRoutes);
router.use("/families/:id/members", familyMembersRoutes);
router.use("/families/:familyId/relationships", familyRelationshipsRoutes);
router.use("/members/:memberId/medications", medicationRoutes);
router.use("/medical-documents", medicalDocumentsRoutes);
router.use("/members", memberRoutes);
router.use("/appointments", appointmentsRoutes);
router.use("/medical-records", medicalRecordsRoutes);

export default router;
