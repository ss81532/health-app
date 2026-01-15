import { Request, Response } from "express";
import { createMember, getMembersByFamily } from "./familyMembers.service";

export async function createFamilyMember(req: Request, res: Response) {
  const familyId = Number(req.params.id);

  if (Number.isNaN(familyId)) {
    return res.status(400).json({ message: "Invalid family id" });
  }

  const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    blood_group,
  } = req.body;

  // 🔴 Required field
  if (!first_name || typeof first_name !== "string") {
    return res.status(400).json({
      message: "first_name is required and must be a string",
    });
  }

  // 🟡 Optional string checks
  if (last_name && typeof last_name !== "string") {
    return res.status(400).json({ message: "last_name must be a string" });
  }

  if (blood_group && typeof blood_group !== "string") {
    return res.status(400).json({ message: "blood_group must be a string" });
  }

  // 🟡 Date validation (YYYY-MM-DD)
  if (date_of_birth) {
    const isValidDate =
      typeof date_of_birth === "string" &&
      !Number.isNaN(Date.parse(date_of_birth));

    if (!isValidDate) {
      return res.status(400).json({
        message: "date_of_birth must be a valid date (YYYY-MM-DD)",
      });
    }
  }

  // 🟡 Enum validation
  if (gender && !["male", "female", "other"].includes(gender)) {
    return res.status(400).json({
      message: "gender must be one of male, female, other",
    });
  }

  const member = await createMember({
    family_id: familyId,
    first_name,
    last_name,
    date_of_birth,
    gender,
    blood_group,
  });

  return res.status(201).json({
    message: "Family member created successfully",
    data: member,
  });
}

export async function getFamilyMembers(req: Request, res: Response) {
  const familyId = Number(req.params.id);

  if (Number.isNaN(familyId)) {
    return res.status(400).json({ message: "Invalid family id" });
  }

  const members = await getMembersByFamily(familyId);

  return res.status(200).json({
    message: "Family members fetched successfully",
    data: members,
  });
}