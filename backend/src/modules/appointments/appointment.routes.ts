import { Router } from "express";
import * as appointmentController from "./appointment.controller";

const router = Router({ mergeParams: true });

// Dashboard upcoming appointments
router.get("/upcoming", appointmentController.getUpcoming);

// Member specific appointments
router.get("/member/:memberId", appointmentController.getByMember);

// Create
router.post("/create", appointmentController.create);

// Update
router.put("/:id", appointmentController.update);

// Delete
router.delete("/:id", appointmentController.remove);

//all by family
router.get("/", appointmentController.getAllByFamily);
export default router;