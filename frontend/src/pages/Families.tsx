import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
} from "react-bootstrap";
import { FiUsers, FiPlus, FiArrowRight } from "react-icons/fi";
import {
  fetchFamilies,
  createFamily,
  type Family,
  type FamilyCreateData,
} from "../api/families.api";
import { Calendar } from "react-bootstrap-icons";

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
      console.error("Failed to load families", err);
    }
  }

  async function handleCreateFamily() {
    if (!newFamilyName.trim()) return;

    try {
      const payload: FamilyCreateData = { name: newFamilyName.trim() };
      await createFamily(payload);

      setShowModal(false);
      setNewFamilyName("");
      loadFamilies();
      setShowToast(true);
    } catch (err) {
      console.error("Failed to create family", err);
      alert("Failed to create family. Please try again.");
    }
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="d-flex align-items-center gap-2">
          <FiUsers /> Families
        </h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FiPlus className="me-1" /> Create Family
        </Button>
      </div>

      {/* Families Grid */}
      {families.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {families.map((family) => (
            <Col key={family.id}>
              <Card
                className="h-100 shadow-sm family-card"
                onClick={() => navigate(`/dashboard/${family.id}`)}
              >
                <Card.Body>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FiUsers className="text-primary" />
                    <Card.Title className="mb-0">
                      {family.name}
                    </Card.Title>
                  </div>

                  <Card.Text className="text-muted mb-3">
                    {family.members_count} members
                  </Card.Text>

                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/${family.id}`);
                    }}
                  >
                    View <FiArrowRight className="ms-1" />
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        /* Empty State */
        <div className="text-center text-muted py-5">
          <FiUsers size={48} className="mb-3 text-primary" />
          <p className="mb-3">No families created yet</p>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FiPlus className="me-1" /> Create your first family
          </Button>
        </div>
      )}

      {/* Create Family Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Family</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Family Name</Form.Label>
              <Form.Control
                autoFocus
                type="text"
                placeholder="e.g. Sharma Family"
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
          <Button
            variant="primary"
            disabled={!newFamilyName.trim()}
            onClick={handleCreateFamily}
          >
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg="success"
        >
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            Family created successfully!
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}
