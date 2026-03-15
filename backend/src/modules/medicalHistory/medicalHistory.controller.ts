import { Request, Response } from "express";
import { fetchMedicalHistory, addMedicalHistory, removeMedicalHistory } from "./medicalHistory.service";


export async function getMemberMedicalHistory(req: Request, res: Response) {
  try {
    const memberId = Number(req.params.memberId);

    const data = await fetchMedicalHistory(memberId);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch medical history" });
  }
}

export async function createMedicalHistory(req: Request, res: Response) {
  try {
    const memberId = Number(req.params.memberId);

    const payload = {
      member_id: memberId,
      record_type: req.body.record_type,
      description: req.body.description,
      recorded_at: req.body.recorded_at
    };

    const result = await addMedicalHistory(payload);

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create medical history" });
  }
}

export async function deleteMedicalHistory(req: Request, res: Response) {
  try {
    const historyId = Number(req.params.historyId);

    await removeMedicalHistory(historyId);

    res.json({ message: "Medical history deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete medical history" });
  }
}