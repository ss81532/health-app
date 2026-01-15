import { Router } from "express";
import familiesRoutes from "../modules/families/families.routes";
import familyMembersRoutes from "../modules/familyMembers/familyMembers.routes";
import familyRelationshipsRoutes from "../modules/familyRelationship/familyRelationships.routes";

const router = Router();

router.use("/families", familiesRoutes);
router.use("/families/:id/members", familyMembersRoutes);
router.use("/families/:familyId/relationships", familyRelationshipsRoutes);

export default router;
