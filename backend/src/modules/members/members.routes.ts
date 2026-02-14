import { Router } from "express";
import * as controller from "./members.controller";

const router = Router({ mergeParams: true });

router.get("/:memberId", controller.getMemberById);

export default router;
