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
import { fetchFamilyById } from "../api/families.api";
import { fetchMembers, createMember, type Member, type MemberCreateData } from "../api/members.api";

export default function Dashboard() {
  const { familyId } = useParams();
  const navigate = useNavigate();

  const [familyName, setFamilyName] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [dateOfBirth, setDateOfBirth] = useState("");
const [gender, setGender] = useState<"male" | "female" | "other">("male");

  // Load family and members on mount
  useEffect(() => {
    if (familyId) {
      loadFamily(Number(familyId));
      loadMembers(Number(familyId));
    }
  }, [familyId]);

  function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}
  async function loadFamily(id: number) {
    try {
      const family = await fetchFamilyById(id);
      setFamilyName(family.name);
    } catch (err) {
      console.error("Failed to fetch family:", err);
    }
  }

  async function loadMembers(id: number) {
  try {
    const res = await fetchMembers(id);

    // SAFETY: ensure array
    const list = Array.isArray(res) ? res : res?.data ?? [];

    setMembers(list);
  } catch (err) {
    console.error("Failed to fetch members:", err);
    setMembers([]); // prevent map crash
  }
}


async function handleCreateMember() {
  if (!familyId) return;

  if (!firstName.trim() || !dateOfBirth) {
    alert("Please fill all required fields.");
    return;
  }

  const payload: MemberCreateData = {
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    date_of_birth: dateOfBirth,
    gender,
  };

  try {
    await createMember(Number(familyId), payload);

    setShowModal(false);
    setFirstName("");
    setLastName("");
    setDateOfBirth("");
    setGender("male");

    await loadMembers(Number(familyId));
    setShowToast(true);
  } catch (err) {
    console.error("Failed to create member:", err);
    alert("Failed to add member.");
  }
}


  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{familyName ? `${familyName} Family Dashboard` : "Dashboard"}</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Add Member
        </Button>
      </div>

      <Row xs={1} md={2} lg={3} className="g-3 mb-4">
        {members.map((member) => (
          <Col key={member.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>{member.first_name} {member.last_name}</Card.Title>
                        <Card.Text>
                            Age: {calculateAge(member.date_of_birth)} <br />
                            Gender: {member.gender}
                        </Card.Text>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => navigate(`/members/${member.id}`)}
                >
                  View
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add Member Modal */}
     <Modal show={showModal} onHide={() => setShowModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Add Member</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>First Name *</Form.Label>
        <Form.Control
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Date of Birth *</Form.Label>
        <Form.Control
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Gender</Form.Label>
        <Form.Select
          value={gender}
          onChange={(e) =>
  setGender(e.target.value as "male" | "female" | "other")
}
        >
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
    <Button variant="primary" onClick={handleCreateMember}>
      Add Member
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
          <Toast.Body className="text-white">Member added successfully!</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}
