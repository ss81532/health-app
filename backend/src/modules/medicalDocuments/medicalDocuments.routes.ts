import { Router } from "express";
import multer from "multer";
import * as controller from "./medicalDocuments.controller";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/upload",
  upload.single("file"),
  controller.uploadDocument
);

router.get(
  "/member/:memberId",
  controller.getDocumentsByMember
);

export default router;
