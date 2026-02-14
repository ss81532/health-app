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
    {/* Header */}
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="fw-semibold mb-1">Medications</h2>
        <small className="text-muted">
          Manage ongoing and past prescriptions
        </small>
      </div>

      <Button variant="primary" onClick={() => setShowModal(true)}>
        + Add Medication
      </Button>
    </div>

    {/* Empty state */}
    {medications.length === 0 && (
      <div className="text-center text-muted py-5">
        <h6>No medications added yet</h6>
        <p className="mb-0">Click “Add Medication” to get started</p>
      </div>
    )}

    {/* Medication Cards */}
    <Row xs={1} md={2} lg={3} className="g-4">
      {medications.map((med) => (
        <Col key={med.id}>
          <Card className="h-100 card">
            <Card.Body className="d-flex flex-column">
              {/* Title */}
              <div className="d-flex justify-content-between align-items-start mb-2">
                <Card.Title className="fw-semibold mb-0">
                  {med.medicine_name}
                </Card.Title>

                {med.is_active && (
                  <Badge bg="success" pill>
                    Active
                  </Badge>
                )}
              </div>

              {/* Meta Info */}
              <div className="text-muted small mb-3">
                <div>
                  <strong>Dosage:</strong> {med.dosage || "-"}
                </div>
                <div>
                  <strong>Frequency:</strong>{" "}
                  <Badge bg="info" className="ms-1">
                    {med.frequency}
                  </Badge>
                </div>
                <div>
                  <strong>Timing:</strong>{" "}
                  {med.timing.map((t) => (
                    <Badge
                      key={t}
                      bg="secondary"
                      className="me-1 text-capitalize"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="small mb-3">
                <div>
                  <strong>Start:</strong> {med.start_date}
                </div>
                <div>
                  <strong>End:</strong> {med.end_date || "-"}
                </div>
              </div>

              {/* Instructions */}
              {med.instructions && (
                <div className="small text-muted mb-3">
                  <strong>Instructions:</strong> {med.instructions}
                </div>
              )}

              {/* Actions */}
              <div className="mt-auto d-flex gap-2">
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => handleEdit(med)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => handleDelete(med.id)}
                >
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>

    {/* Modal */}
    <Modal
      show={showModal}
      onHide={() => {
        setShowModal(false);
        resetForm();
      }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {editingMedication ? "Edit Medication" : "Add Medication"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Medicine Name *</Form.Label>
            <Form.Control
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder="e.g. Paracetamol"
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Dosage</Form.Label>
                <Form.Control
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g. 500mg"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Frequency *</Form.Label>
                <Form.Select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                >
                  <option value="once">Once</option>
                  <option value="twice">Twice</option>
                  <option value="thrice">Thrice</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Timing *</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {["morning", "afternoon", "evening", "night"].map((t) => (
                <Form.Check
                  key={t}
                  type="checkbox"
                  label={t}
                  checked={timing.includes(t)}
                  onChange={() => toggleTiming(t)}
                />
              ))}
            </div>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Start Date *</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-2">
            <Form.Label>Instructions</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </Form.Group>

          <Form.Check
            className="mt-3"
            type="checkbox"
            label="Mark as Active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setShowModal(false);
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {editingMedication ? "Update Medication" : "Add Medication"}
        </Button>
      </Modal.Footer>
    </Modal>

    {/* Toast */}
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
          {editingMedication
            ? "Medication updated successfully!"
            : "Medication added successfully!"}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  </Container>
);

}
