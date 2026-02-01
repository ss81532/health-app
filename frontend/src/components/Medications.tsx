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
  Badge
} from "react-bootstrap";
import {
  fetchMedications,
  createMedication,
  updateMedication,
  deleteMedication,
  type Medication,
  type MedicationCreateData
} from "../api/medications.api"; // your API layer

export default function Medications() {
  const { memberId } = useParams();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);

  // Form state
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState<"once" | "twice" | "thrice">("once");
  const [timing, setTiming] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (memberId) loadMedications();
  }, [memberId]);

  async function loadMedications() {
    if (!memberId) return;
    const data = await fetchMedications(Number(memberId));
    setMedications(data);
  }

  function resetForm() {
    setMedicineName("");
    setDosage("");
    setFrequency("once");
    setTiming([]);
    setStartDate("");
    setEndDate("");
    setInstructions("");
    setIsActive(true);
    setEditingMedication(null);
  }

  async function handleSubmit() {
    if (!medicineName || !startDate) {
      alert("Please fill required fields");
      return;
    }

    const payload: MedicationCreateData = {
      medicine_name: medicineName,
      dosage,
      frequency,
      timing,
      start_date: startDate,
      end_date: endDate || undefined,
      instructions,
      is_active: isActive,
    };

    try {
      if (editingMedication) {
        await updateMedication(editingMedication.id, payload);
      } else {
        await createMedication(Number(memberId), payload);
      }
      setShowModal(false);
      resetForm();
      loadMedications();
      setShowToast(true);
    } catch (err) {
      console.error(err);
      alert("Failed to save medication");
    }
  }

  async function handleEdit(med: Medication) {
    setEditingMedication(med);
    setMedicineName(med.medicine_name);
    setDosage(med.dosage || "");
    setFrequency(med.frequency);
    setTiming(med.timing);
    setStartDate(med.start_date);
    setEndDate(med.end_date || "");
    setInstructions(med.instructions || "");
    setIsActive(med.is_active);
    setShowModal(true);
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure to delete this medication?")) return;
    await deleteMedication(id);
    loadMedications();
  }

  function toggleTiming(value: string) {
    setTiming(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Medications</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>+ Add Medication</Button>
      </div>

      <Row xs={1} md={2} lg={3} className="g-3 mb-4">
        {medications.map(med => (
          <Col key={med.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>
                  {med.medicine_name}{" "}
                  {med.is_active && <Badge bg="success">Active</Badge>}
                </Card.Title>
                <Card.Text>
                  Dosage: {med.dosage || "-"} <br/>
                  Frequency: {med.frequency} <br/>
                  Timing: {med.timing.join(", ")} <br/>
                  Start: {med.start_date} <br/>
                  End: {med.end_date || "-"} <br/>
                  Instructions: {med.instructions || "-"}
                </Card.Text>
                <Button size="sm" variant="outline-secondary" onClick={() => handleEdit(med)}>Edit</Button>{" "}
                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(med.id)}>Delete</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingMedication ? "Edit Medication" : "Add Medication"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Medicine Name *</Form.Label>
              <Form.Control value={medicineName} onChange={e => setMedicineName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Dosage</Form.Label>
              <Form.Control value={dosage} onChange={e => setDosage(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Frequency *</Form.Label>
              <Form.Select value={frequency} onChange={e => setFrequency(e.target.value as any)}>
                <option value="once">Once</option>
                <option value="twice">Twice</option>
                <option value="thrice">Thrice</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Timing *</Form.Label><br/>
              {["morning","afternoon","evening","night"].map(t => (
                <Form.Check
                  inline
                  key={t}
                  label={t}
                  type="checkbox"
                  checked={timing.includes(t)}
                  onChange={() => toggleTiming(t)}
                />
              ))}
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Start Date *</Form.Label>
              <Form.Control type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>End Date</Form.Label>
              <Form.Control type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Instructions</Form.Label>
              <Form.Control value={instructions} onChange={e => setInstructions(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Check type="checkbox" label="Active" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>{editingMedication ? "Update" : "Add"}</Button>
        </Modal.Footer>
      </Modal>

      {/* Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="success">
          <Toast.Header><strong className="me-auto">Success</strong></Toast.Header>
          <Toast.Body className="text-white">{editingMedication ? "Medication updated" : "Medication added"} successfully!</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}
