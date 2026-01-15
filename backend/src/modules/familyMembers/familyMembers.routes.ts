import { Router } from "express";
import {
  createFamilyMember,
  getFamilyMembers,
} from "./familyMembers.controller";

const router = Router({ mergeParams: true });

// POST /api/families/:id/members
router.post("/", createFamilyMember);

// GET /api/families/:id/members
router.get("/", getFamilyMembers);

export default router;
