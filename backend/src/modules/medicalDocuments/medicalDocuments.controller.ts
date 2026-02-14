import { Request, Response } from "express";
import * as service from "./medicalDocuments.service";

export async function getDocumentsByMember(req: Request, res: Response) {
  try {
    const memberId = Number(req.params.memberId);

    if (!memberId) {
      return res.status(400).json({ message: "Invalid member id" });
    }

    const docs = await service.getDocumentsByMember(memberId);
    res.json(docs);
  } catch (e) {
    console.error("Get documents failed", e);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
}

export async function uploadDocument(req: Request, res: Response) {
  try {
    const memberId = Number(req.body.memberId); // 🔹 read from body
    const documentType = req.body.document_type;

    if (!memberId || !req.file) {
      return res.status(400).json({ message: "Invalid upload request" });
    }

    const document = await service.saveDocument(
      memberId,
      req.file,
      documentType
    );

    res.status(201).json(document);
  } catch (e) {
    console.error("Upload document failed", e);
    res.status(500).json({ message: "Failed to upload document" });
  }
}

