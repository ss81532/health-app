import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Toast,
  ToastContainer,
  Table,
  Badge,
} from "react-bootstrap";
import {

  fetchMedications,
  createMedication,
  type Medication,
  type MedicationCreateData,
} from "../api/medications.api";
import { fetchMemberById, fetchMembers, type Member } from "../api/members.api";
import { calculateAge, formatDate } from "../utils/helper";
import { fetchMedicalDocuments, uploadMedicalDocument, type MedicalDocument } from "../api/medicalDocuments.api";
import { Calendar, HeartPulse, Person, PersonCircle } from "react-bootstrap-icons";
import { createMedicalRecord, deleteMedicalRecord, getMedicalRecords } from "../api/medical-records.api";

export default function MemberDetails() {
  const { memberId } = useParams();
  const [member, setMember] = useState<Member | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Medication form state
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState<"once" | "twice" | "thrice">(
    "once"
  );
  const [timing, setTiming] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [instructions, setInstructions] = useState("");

  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [uploading, setUploading] = useState(false);
const [docsLoading, setDocsLoading] = useState(false);
const [docsError, setDocsError] = useState<string | null>(null);
// medical history state
const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
const [showRecordModal, setShowRecordModal] = useState(false);

const [recordType, setRecordType] = useState("diagnosis");
const [description, setDescription] = useState("");
const [recordedAt, setRecordedAt] = useState("");

//modal

const FILE_BASE_URL = 'http://4.213.2.193:3000'
  // Load member and medications
useEffect(() => {
  const id = Number(memberId);
  if (!id || isNaN(id)) return;

  loadMember(id);
  loadMedications(id);
  loadDocuments(id);
   fetchMedicalRecords(id);
}, [memberId]);



  async function loadMember(id: number) {
    try {
      const m = await fetchMemberById(id);
      setMember(m);
    } catch (err) {
      console.error("Failed to fetch member:", err);
    }
  }

  async function loadMedications(id: number) {
    try {
      const meds = await fetchMedications(id);
      const list = Array.isArray(meds) ? meds : meds?.data ?? [];
      setMedications(list);
    } catch (err) {
      console.error("Failed to fetch medications:", err);
      setMedications([]);
    }
  }

async function loadDocuments(id: number) {
  try {
    setDocsLoading(true);
    setDocsError(null);

    const docs = await fetchMedicalDocuments(id);

    // Defensive check
    if (!Array.isArray(docs)) {
      throw new Error("Invalid documents response");
    }

    setDocuments(docs);
  } catch (e: any) {
    console.error("Failed to load documents", e);

    if (e?.response?.status === 404) {
      setDocsError("No documents found for this member.");
      setDocuments([]);
    } else if (e?.response?.status === 500) {
      setDocsError("Server error while loading documents.");
    } else {
      setDocsError("Unable to load documents. Please try again.");
    }
  } finally {
    setDocsLoading(false);
  }
}

async function fetchMedicalRecords(memberId: number) {
  try {
    const data = await getMedicalRecords(memberId);
    setMedicalRecords(data);
  } catch (err) {
    console.error("Failed to load medical records", err);
  }
}

async function createMedicalRecords(memberId: number, payload: any) {
  try {
    await createMedicalRecord(memberId, payload);
    fetchMedicalRecords(memberId);
  } catch (err) {
    console.error("Failed to create medical record", err);
  }
}

async function deleteMedicalRecords(memberId: number, historyId: number) {
  try {
    await deleteMedicalRecord(memberId, historyId);
    fetchMedicalRecords(memberId);
  } catch (err) {
    console.error("Failed to delete medical record", err);
  }
}
  async function handleAddMedication() {
    if (!medicineName.trim() || !frequency || timing.length === 0 || !startDate)
      return alert("Please fill all required fields");

    const payload: MedicationCreateData = {
      medicine_name: medicineName.trim(),
      dosage: dosage.trim(),
      frequency,
      timing,
      start_date: startDate,
      end_date: endDate || null,
      instructions: instructions.trim(),
      is_active: true,
    };

    try {
      if (!memberId) return;
      await createMedication(Number(memberId), payload);

      setShowAddModal(false);
      setMedicineName("");
      setDosage("");
      setFrequency("once");
      setTiming([]);
      setStartDate("");
      setEndDate("");
      setInstructions("");

      await loadMedications(Number(memberId));
      setShowToast(true);
    } catch (err) {
      console.error("Failed to add medication:", err);
      alert("Failed to add medication.");
    }
  }

  const handleTimingChange = (time: string) => {
    if (timing.includes(time)) {
      setTiming(timing.filter((t) => t !== time));
    } else {
      setTiming([...timing, time]);
    }
  };

  async function handleUploadDocument() {
  if (!selectedFile || !memberId) return;

  if (selectedFile.type !== "application/pdf") {
    return alert("Only PDF files are allowed");
  }

  try {
    setUploading(true);
    await uploadMedicalDocument(Number(memberId), selectedFile);
    setSelectedFile(null);
    await loadDocuments(Number(memberId));
  } catch (e) {
    alert("Upload failed");
  } finally {
    setUploading(false);
  }
}
  

  return (
    <Container className="py-4">
      {member && (
        <Card className="mb-4 card">
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-semibold mb-1">
                <PersonCircle className="me-2 text-primary" size={20} />{member.first_name} {member.last_name}
              </h5>
              <div className="text-muted small d-flex align-items-center gap-2">
                <Calendar size={14} /> Age: {calculateAge(member.date_of_birth)} ·{" "}
                <Person size={14} /> {member.gender}
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-semibold">Medications</h4>
        <Button size="sm" variant="primary" onClick={() => setShowAddModal(true)}>
          + Add Medication
        </Button>
      </div>

      {/* <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Dosage</th>
            <th>Frequency</th>
            <th>Timing</th>
            <th>Start</th>
            <th>End</th>
            <th>Instructions</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {medications.map((med) => (
            <tr key={med.id}>
              <td>{med.medicine_name}</td>
              <td>{med.dosage}</td>
              <td>{med.frequency}</td>
              <td>{med.timing.join(", ")}</td>
              <td>{med.start_date}</td>
              <td>{med.end_date || "-"}</td>
              <td>{med.instructions || "-"}</td>
              <td>{med.is_active ? "Active" : "Inactive"}</td>
            </tr>
          ))}
          {medications.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center">
                No medications added yet.
              </td>
            </tr>
          )}
        </tbody>
      </Table> */}
      <Card className="card mb-4">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Timing</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {medications.map((med) => (
                <tr key={med.id}>
                  <td className="fw-medium">{med.medicine_name}</td>
                  <td>{med.dosage || "-"}</td>

                  <td>
                    <Badge bg="info">{med.frequency}</Badge>
                  </td>

                  <td>
                    {med.timing.map((t) => (
                      <Badge
                        key={t}
                        bg="secondary"
                        className="me-1 text-capitalize"
                      >
                        {t}
                      </Badge>
                    ))}
                  </td>

                  <td className="small">
                    {formatDate(med.start_date)} → {formatDate(med?.end_date)}
                  </td>

                  <td>
                    <Badge bg={med.is_active ? "success" : "secondary"}>
                      {med.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                </tr>
              ))}

              {medications.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    No medications added yet
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add Medication Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Medication</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Medicine Name *</Form.Label>
              <Form.Control
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Dosage</Form.Label>
              <Form.Control
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Frequency *</Form.Label>
              <Form.Select
                value={frequency}
                onChange={(e) =>
                  setFrequency(e.target.value as "once" | "twice" | "thrice")
                }
              >
                <option value="once">Once</option>
                <option value="twice">Twice</option>
                <option value="thrice">Thrice</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Timing *</Form.Label>
              <div>
                {["morning", "afternoon", "evening", "night"].map((time) => (
                  <Form.Check
                    inline
                    key={time}
                    type="checkbox"
                    label={time.charAt(0).toUpperCase() + time.slice(1)}
                    checked={timing.includes(time)}
                    onChange={() => handleTimingChange(time)}
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Start Date *</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Instructions</Form.Label>
              <Form.Control
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddMedication}>
            Add Medication
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg="success"
        >
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            Medication added successfully!
          </Toast.Body>
        </Toast>
      </ToastContainer>

{/* Medical History */}
      {/* <hr className="my-4" /> */}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-semibold">
          <HeartPulse className="me-2 text-danger" size={20} />
          Medical History
        </h4>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setShowRecordModal(true)}
        >
          + Add Record
        </Button>
      </div>

{/* Add Medical Record Modal */}
<Modal
  show={showRecordModal}
  onHide={() => setShowRecordModal(false)}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>Add Medical History</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Type *</Form.Label>
        <Form.Select
          value={recordType}
          onChange={(e) => setRecordType(e.target.value)}
        >
          <option value="diagnosis">Diagnosis</option>
          <option value="condition">Condition</option>
          <option value="allergy">Allergy</option>
          <option value="surgery">Surgery</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description *</Form.Label>
        <Form.Control
          placeholder="Example: Diabetes Type 2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          value={recordedAt}
          onChange={(e) => setRecordedAt(e.target.value)}
        />
      </Form.Group>
    </Form>
  </Modal.Body>

  <Modal.Footer>
    <Button
      variant="secondary"
      onClick={() => setShowRecordModal(false)}
    >
      Cancel
    </Button>

    <Button
      variant="primary"
      onClick={async () => {
        await createMedicalRecords(memberId, {
          record_type: recordType,
          description,
          recorded_at: recordedAt
        });

        setShowRecordModal(false);

        // reset form
        setDescription("");
        setRecordedAt("");
        setRecordType("diagnosis");
      }}
    >
      Add Record
    </Button>
  </Modal.Footer>
</Modal>
<Card className="card mb-4">
  <Card.Body className="p-0">
    <Table responsive hover className="mb-0 align-middle">
      <thead className="table-light">
        <tr>
          <th>Condition</th>
          <th>Type</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {medicalRecords.map((record) => (
          <tr key={record.id}>
            <td className="fw-medium">{record.description}</td>

            <td>
              <Badge bg="warning" className="text-capitalize">
                {record.record_type}
              </Badge>
            </td>

            <td className="small text-muted">
              {record.recorded_at
                ? new Date(record.recorded_at).toLocaleDateString()
                : "-"}
            </td>

            <td>
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() =>
                  deleteMedicalRecords(memberId, record.id)
                }
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}

        {medicalRecords.length === 0 && (
          <tr>
            <td colSpan={4} className="text-center text-muted py-4">
              No medical history recorded
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  </Card.Body>
</Card>
      <hr className="my-4" />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-semibold">Medical Documents</h4>
      </div>

      {/* <Card className="mb-4 shadow-sm">
  <Card.Body>
    <Form.Group className="mb-3">
      <Form.Label>Upload PDF</Form.Label>
      <Form.Control
        type="file"
        accept="application/pdf"
        onChange={(e) =>
          setSelectedFile(e.target.files?.[0] ?? null)
        }
      />
    </Form.Group>

    <Button
      variant="primary"
      disabled={!selectedFile || uploading}
      onClick={handleUploadDocument}
    >
      {uploading ? "Uploading..." : "Upload Document"}
    </Button>
  </Card.Body>
</Card> */}
      <Card className="card mb-3">
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium">
              Upload Medical PDF
            </Form.Label>
            <Form.Control
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                setSelectedFile(e.target.files?.[0] ?? null)
              }
            />
          </Form.Group>

          <Button
            variant="primary"
            disabled={!selectedFile || uploading}
            onClick={handleUploadDocument}
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </Button>
        </Card.Body>
      </Card>

      {/* Documents Table */}
      <Card className="card">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Document</th>
                <th>Uploaded</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="fw-medium">
                    📄 {doc.document_name}
                  </td>
                  <td className="small text-muted">
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </td>
                  <td>
                    <a
                      href={`${FILE_BASE_URL}${doc.file_url}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}

              {docsLoading && (
                <tr>
                  <td colSpan={3} className="text-center py-3">
                    Loading documents...
                  </td>
                </tr>
              )}

              {docsError && !docsLoading && (
                <tr>
                  <td colSpan={3} className="text-center text-danger">
                    {docsError}
                  </td>
                </tr>
              )}

              {!docsLoading && !docsError && documents.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-muted py-4">
                    No documents uploaded yet
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* <Table bordered hover>
  <thead>
    <tr>
      <th>File Name</th>
      <th>Uploaded At</th>
      <th>View</th>
    </tr>
  </thead>
  <tbody>
    {documents.map((doc) => (
      <tr key={doc.id}>
        <td>
          📄 {doc.document_name}
        </td>
        <td>{new Date(doc.uploaded_at).toLocaleDateString()}</td>
        <td>
          <a href={`${FILE_BASE_URL}${doc.file_url}`} target="self" rel="noreferrer">
            View
          </a>
        </td>
      </tr>
    ))}
    {docsLoading && (
  <tr>
    <td colSpan={3} className="text-center">
      Loading documents...
    </td>
  </tr>
)}

{docsError && !docsLoading && (
  <tr>
    <td colSpan={3} className="text-center text-danger">
      {docsError}
    </td>
  </tr>
)}

{!docsLoading && !docsError && documents.length === 0 && (
  <tr>
    <td colSpan={3} className="text-center">
      No documents uploaded yet.
    </td>
  </tr>
)}

  </tbody>
</Table> */}
    </Container>
  );

}
