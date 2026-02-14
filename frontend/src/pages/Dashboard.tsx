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
import {
  PersonPlus,
  PersonCircle,
  GenderMale,
  GenderFemale,
  GenderAmbiguous
} from "react-bootstrap-icons";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import FamilyTree from "../components/FamilyTree";
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

const [relationships, setRelationships] = useState<FamilyRelationship[]>([]);
const [loadingTree, setLoadingTree] = useState(true);
 interface FamilyRelationship {
  id: number;
  family_id: number;
  member_id: number;
  related_member_id: number;
  relationship_type: "father" | "mother" | "son" | "daughter" | "spouse" | "sibling" | "grandparent" | "grandchild";
  created_at: string;
}
  // Load family and members on mount
  useEffect(() => {
    if (familyId) {
      loadFamily(Number(familyId));
      loadMembers(Number(familyId));
      fetchRelationships()
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
async function fetchRelationships () {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/families/${familyId}/relationships`
      );
      setRelationships(res.data.data);
    } catch (err) {
      console.error("Failed to load family tree", err);
    } finally {
      setLoadingTree(false);
    }
  };

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
    await fetchRelationships()
    setShowToast(true);
  } catch (err) {
    console.error("Failed to create member:", err);
    alert("Failed to add member.");
  }
}




return (
  <Container className="py-4">
    {/* Header */}
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
       <h1 className="mb-1">
  {familyName ? `${familyName} Family` : "Family Members"}
  <span className="badge rounded-pill bg-success ms-3 px-3">
  {members.length}
</span>
</h1>
      </div>

      <Button variant="primary" onClick={() => setShowModal(true)}>
        <PersonPlus className="me-2" />
        Add Member
      </Button>
    </div>

    {/* Empty State */}
    {members.length === 0 ? (
      <Card className="text-center p-5 shadow-sm">
        <PersonCircle size={48} className="text-primary mb-3" />
        <h5>No members yet</h5>
        <p className="text-muted">
          Start by adding your first family member.
        </p>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Member
        </Button>
      </Card>
    ) : (
      <Row xs={1} md={2} lg={3} className="g-3 mb-4">
        {members.map((member) => (
          <Col key={member.id}>
            <Card
              className="h-100 family-card shadow-sm"
              onClick={() => navigate(`/members/${member.id}`)}
            >
              <Card.Body>
                {/* Avatar + Name */}
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3 text-primary">
                    <PersonCircle size={36} />
                  </div>
                  <div>
                    <Card.Title className="mb-0">
                      {member.first_name} {member.last_name}
                    </Card.Title>
                    <small className="text-muted">
                      Age {calculateAge(member.date_of_birth)}
                    </small>
                  </div>
                </div>

                {/* Metadata */}
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge bg-light text-primary border">
                    {member.gender === "male" && <GenderMale className="me-1" />}
                    {member.gender === "female" && <GenderFemale className="me-1" />}
                    {member.gender === "other" && <GenderAmbiguous className="me-1" />}
                    {member.gender}
                  </span>

                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/members/${member.id}`);
                    }}
                  >
                    View
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    )}

    {/* Add Member Modal */}
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Family Member</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>First Name *</Form.Label>
            <Form.Control
              required
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
              required
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
        <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
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
        show={showToast}
        delay={3000}
        autohide
        bg="success"
        onClose={() => setShowToast(false)}
      >
        <Toast.Header>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body className="text-white">
          Member added successfully!
        </Toast.Body>
      </Toast>
    </ToastContainer>
    {/* Family Tree */}
<Card className="mt-4 shadow-sm">
  <Card.Header className="fw-semibold">
    Family Tree
  </Card.Header>

  <Card.Body style={{ height: 550 }}>
    {loadingTree ? (
      <div className="text-muted text-center py-5">
        Loading family tree...
      </div>
    ) : (
      <FamilyTree members={members} relationships={relationships} />
    )}
  </Card.Body>
</Card>

  </Container>
);

}
