import { Request, Response, NextFunction } from "express";
import * as familyService from "./families.service";

export async function createFamily(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Family name is required",
      });
    }

    const family = await familyService.createFamily({
      name,
      description,
    });

    res.status(201).json({
      message: "Family created successfully",
      data: family,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFamily(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid family id" });
    }

    const family = await familyService.getFamilyById(id);

    if (!family) {
      return res.status(404).json({
        message: "Family not found",
      });
    }

    res.json({
      data: family,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFamilies(_: Request, res: Response) {
  const families = await familyService.getAllFamilies();
  res.json(families);
}

export async function getActiveFamilyMedications(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const meds =
      await familyService.getActiveFamilyMedications(
        Number(id)
      );

    res.json({
      success: true,
      data: meds,
    });
  } catch (error) {
    console.error("Failed to fetch active medications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch medications",
    });
  }
}