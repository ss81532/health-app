import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form, Toast, ToastContainer } from "react-bootstrap";
import { fetchFamilies, createFamily, type Family, type FamilyCreateData } from "../api/families.api";

export default function Families() {
  const navigate = useNavigate();
  const [families, setFamilies] = useState<Family[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    loadFamilies();
  }, []);

  async function loadFamilies() {
    try {
      const data = await fetchFamilies();
      setFamilies(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreateFamily() {
    if (!newFamilyName.trim()) return;

    try {
      const newFamily: FamilyCreateData = { name: newFamilyName.trim() };

      await createFamily(newFamily);

      setShowModal(false);
      setNewFamilyName("");

      loadFamilies();

      // Show toast
      setShowToast(true);
    } catch (err) {
      console.error("Failed to create family:", err);
      alert("Failed to create family. Please try again.");
    }
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Families</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Create Family
        </Button>
      </div>

      <Row xs={1} md={2} lg={3} className="g-3">
        {families.map((family) => (
          <Col key={family.id}>
            <Card
              className="h-100 shadow-sm"
              onClick={() => navigate(`/dashboard/${family.id}`)}
              style={{ cursor: "pointer" }}
            >
              <Card.Body>
                <Card.Title>{family.name}</Card.Title>
                <Card.Text>{family.members_count} members</Card.Text>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/${family.id}`);
                  }}
                >
                  View
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Create Family Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Family</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="familyName">
              <Form.Label>Family Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter family name"
                value={newFamilyName}
                onChange={(e) => setNewFamilyName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateFamily}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notification */}
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
          <Toast.Body className="text-white">Family created successfully!</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}
