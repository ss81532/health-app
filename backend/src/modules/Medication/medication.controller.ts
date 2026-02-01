

import { Request, Response } from "express";
import * as medicationService from "./medication.service";

export async function createMedication(req: Request, res: Response) {
  try {
    const memberId = Number(req.params.memberId);
    const data = req.body;
    const result = await medicationService.createMedication(memberId, data);
    res.status(201).json({ message: "Medication created", data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create medication" });
  }
}

export async function getMedications(req: Request, res: Response) {
  try {
    const memberId = Number(req.params.memberId);
    const meds = await medicationService.getMedications(memberId);
    res.json({ message: "Medications fetched successfully", data: meds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch medications" });
  }
}

export async function getActiveMedications(req: Request, res: Response) {
  try {
    const memberId = Number(req.params.memberId);
    const meds = await medicationService.getActiveMedications(memberId);
    res.json({ message: "Active medications fetched successfully", data: meds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch active medications" });
  }
}

export async function updateMedication(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const updated = await medicationService.updateMedication(id, data);
    res.json({ message: "Medication updated", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update medication" });
  }
}

export async function deleteMedication(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await medicationService.deleteMedication(id);
    res.json({ message: "Medication deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete medication" });
  }
}

