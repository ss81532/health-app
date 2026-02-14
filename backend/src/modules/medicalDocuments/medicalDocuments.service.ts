import path from "path";
import { db } from "../../db/mysql";


export async function getDocumentsByMember(memberId: number) {
  const [rows] = await db.query(
    `SELECT 
       id,
       document_name,
       document_type,
       file_url,
       uploaded_at
     FROM medical_documents
     WHERE member_id = ?
     ORDER BY uploaded_at DESC`,
    [memberId]
  );

  return rows;
}

// export async function saveDocument(
//   memberId: number,
//   file: Express.Multer.File,
//   documentType?: string
// ) {
//   const fileUrl = `/uploads/${file.filename}`;

//   const [result]: any = await db.query(
//     `INSERT INTO medical_documents
//      (member_id, document_type, file_url)
//      VALUES (?, ?, ?)`,
//     [memberId, documentType ?? "general", fileUrl]
//   );

//   return {
//     id: result.insertId,
//     member_id: memberId,
//     document_type: documentType ?? "general",
//     file_url: fileUrl,
//   };
// }
export async function saveDocument(
  memberId: number,
  file: Express.Multer.File,
  documentType?: string
) {
  const documentName = file.originalname;

  const [result] = await db.execute(
    `
    INSERT INTO medical_documents
      (member_id, document_name, document_type, file_url)
    VALUES (?, ?, ?, ?)
    `,
    [
      memberId,
      documentName,
      documentType ?? "general",
      `/uploads/${file.filename}`,
    ]
  );

  return {
    id: (result as any).insertId,
    member_id: memberId,
    document_name: documentName,
    document_type: documentType ?? "general",
    file_url: `/uploads/${file.filename}`,
  };
}