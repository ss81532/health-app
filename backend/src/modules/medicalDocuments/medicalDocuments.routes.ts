import { Router } from "express";
import multer from "multer";
import * as controller from "./medicalDocuments.controller";

const router = Router();
// const upload = multer({ dest: "uploads/" });
// import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // keep .pdf
    const uniqueName = Date.now() + ext;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });

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
