import { useNavigate, useParams } from "react-router-dom";
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
import {
  fetchMembers,
  createMember,
  type Member,
  type MemberCreateData,
} from "../api/members.api";
import { calculateAge } from "../utils/helper";



export default function Members() {
  const navigate = useNavigate();
  const { familyId } = useParams<{ familyId: string }>();

  const [members, setMembers] = useState<Member[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");

  useEffect(() => {
    if (familyId) loadMembers();
  }, [familyId]);

  async function loadMembers() {
    try {
      const res = await fetchMembers(Number(familyId));
      setMembers(res); // API already returns array
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreateMember() {
    if (!familyId) return;

    if (!firstName || !lastName || !dob) {
      alert("Please fill all required fields");
      return;
    }

    const payload: MemberCreateData = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      date_of_birth: dob,
      gender,
    };

    try {
      await createMember(Number(familyId), payload);

      setShowModal(false);
      setFirstName("");
      setLastName("");
      setDob("");
      setGender("male");

      loadMembers();
      setShowToast(true);
    } catch (err) {
      console.error("Failed to create member:", err);
      alert("Failed to add member");
    }
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Members</h1>
        <Button onClick={() => setShowModal(true)}>+ Add Member</Button>
      </div>

      <Row xs={1} md={2} lg={3} className="g-3">
        {members.map((m) => (
          <Col key={m.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>
                  {m.first_name} {m.last_name}
                </Card.Title>
                <Card.Text>
                  Age: {calculateAge(m.date_of_birth)} <br />
                  Gender: {m.gender}
                </Card.Text>
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => navigate(`/members/${m.id}`)}
                >
                  View
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>First Name</Form.Label>
              <Form.Control value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Last Name</Form.Label>
              <Form.Control value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Gender</Form.Label>
              <Form.Select value={gender} onChange={(e) => setGender(e.target.value as any)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateMember}>Add</Button>
        </Modal.Footer>
      </Modal>

      {/* Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast bg="success" show={showToast} autohide delay={3000} onClose={() => setShowToast(false)}>
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            Member added successfully
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}
