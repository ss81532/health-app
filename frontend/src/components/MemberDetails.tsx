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
} from "react-bootstrap";
import {

  fetchMedications,
  createMedication,
  type Medication,
  type MedicationCreateData,
} from "../api/medications.api";
import { fetchMembers, type Member } from "../api/members.api";
import { calculateAge } from "../utils/helper";

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

  // Load member and medications
  useEffect(() => {
    if (memberId) {
      loadMember(Number(memberId));
      loadMedications(Number(memberId));
    }
  }, [memberId]);



  async function loadMember(id: number) {
    try {
      const m = await fetchMembers(id);
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

  return (
    <Container className="py-4">
      {member && (
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Card.Title>
              {member.first_name} {member.last_name}
            </Card.Title>
            <Card.Text>
              Age: {calculateAge(member.date_of_birth)} <br />
              Gender: {member.gender} <br />
            </Card.Text>
          </Card.Body>
        </Card>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Medications</h4>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          + Add Medication
        </Button>
      </div>

      <Table striped bordered hover>
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
      </Table>

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
    </Container>
  );
}
