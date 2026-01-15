import { Router } from "express";
import * as controller from "./familyRelationships.controller";

const router = Router({ mergeParams: true });

// Create relationship (auto reverse)
router.post("/", controller.createRelationship);

// Get all relationships by family
router.get("/", controller.getRelationshipsByFamily);

// Optional: get relationships for a single member
router.get("/member/:memberId", controller.getRelationshipsByMember);

export default router;
