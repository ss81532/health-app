import { Request, Response } from "express";
import * as service from "./familyRelationships.service";

export async function createRelationship(req: Request, res: Response) {
  try {
    const family_id = parseInt(req.params.familyId);
    const { member_id, related_member_id, relationship_type } = req.body;

    // Basic validation
    if (!member_id || !related_member_id || !relationship_type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await service.createRelationship({
      family_id,
      member_id,
      related_member_id,
      relationship_type,
    });

    res.json({
      message: "Relationship created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function getRelationshipsByMember(req: Request, res: Response) {
  try {
    const member_id = parseInt(req.params.memberId);
    const data = await service.getRelationshipsByMember(member_id);
    res.json({ message: "Member relationships fetched successfully", data });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function getRelationshipsByFamily(req: Request, res: Response) {
  try {
    const family_id = parseInt(req.params.familyId);
    const data = await service.getRelationshipsByFamily(family_id);
    res.json({ message: "Family relationships fetched successfully", data });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
