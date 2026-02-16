import { Request, Response } from "express";
import * as appointmentService from "./appointment.service";

export async function getUpcoming(req: Request, res: Response) {
  try {
    const familyId = Number(req.query.familyId);
    const data = await appointmentService.getUpcomingByFamily(familyId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch upcoming appointments" });
  }
}

export async function getByMember(req: Request, res: Response) {
  try {
    const memberId = Number(req.params.memberId);
    const data = await appointmentService.getAppointmentsByMember(memberId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch member appointments" });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const insertId = await appointmentService.createAppointment(req.body);
    res.status(201).json({ id: insertId, message: "Appointment created" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create appointment" });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await appointmentService.updateAppointment(id, req.body);
    res.json({ message: "Appointment updated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update appointment" });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await appointmentService.deleteAppointment(id);
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete appointment" });
  }
}

export async function getAllByFamily(req: Request, res: Response) {
  try {
    const familyId = Number(req.query.familyId);
    const data = await appointmentService.getAllByFamily(familyId);
    res.json(data);
  } catch {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
}