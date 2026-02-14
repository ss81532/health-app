import { Request, Response } from "express";
import * as service from "./members.service";

export async function getMemberById(req: Request, res: Response) {
  try {
    const memberId = Number(req.params.memberId);

    if (!memberId) {
      return res.status(400).json({ message: "Invalid member id" });
    }

    const member = await service.getMemberById(memberId);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json(member);
  } catch (e) {
    console.error("Fetch member failed", e);
    res.status(500).json({ message: "Failed to fetch member" });
  }
}
