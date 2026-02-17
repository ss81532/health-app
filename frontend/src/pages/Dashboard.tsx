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
  Capsule,
  Clock,
  Calendar,
  Person,
  HeartPulse
} from "react-bootstrap-icons";
import {
  People,
  PersonBadge
} from "react-bootstrap-icons";
import { fetchFamilyById } from "../api/families.api";
import { fetchMembers, createMember, type Member, type MemberCreateData } from "../api/members.api";

import {
  Telephone,
  TelephoneFill,
  PersonFill,
  PeopleFill,
  PersonPlus,
  PersonCircle,
  CalendarCheck
} from "react-bootstrap-icons";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import FamilyTree from "../components/FamilyTree";
import { fetchActiveFamilyMedications } from "../api/medications.api";
import { formatDate } from "../utils/helper";
import UpcomingAppointments from "../components/appointments/UpcomingAppointments";
import { dataService } from "../services/data.service";
import { fetchUpcomingAppointments } from "../api/appointment.api";
export default function Dashboard() {
  const { familyId } = useParams();
dataService.setSelectedFamily(familyId)
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
  const emergencyContacts = [
    {
      id: 1,
      name: "Ramesh Sharma",
      relationship: "Father",
      phone: "+91 9876543210",
      notes: "Primary contact"
    },
    {
      id: 2,
      name: "Dr. Mehta",
      relationship: "Family Doctor",
      phone: "+91 9123456780",
      notes: "Available 9am–6pm"
    }
  ];

  const loadingContacts = false;
  const [activeMedications, setActiveMedications] = useState<any[]>([]);
  const [loadingMeds, setLoadingMeds] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [refreshAppointments, setRefreshAppointments] = useState(0);
  const payload = {
    id: selectedAppointment?.id,
    doctor_name: selectedAppointment?.doctor_name,
    hospital_name: selectedAppointment?.hospital_name,
    appointment_date: selectedAppointment?.appointment_date.split("T")[0],
    reason: selectedAppointment?.reason,
    notes: selectedAppointment?.notes || null,
  };
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
      loadActiveMedications(Number(familyId));
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
  async function fetchRelationships() {
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

  async function loadActiveMedications(id: number) {
    try {
      setLoadingMeds(true);
      const meds = await fetchActiveFamilyMedications(id);
      setActiveMedications(meds ?? []);
    } catch (err) {
      console.error("Failed to load active medications:", err);
      setActiveMedications([]);
    } finally {
      setLoadingMeds(false);
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
      await fetchRelationships()
      setShowToast(true);
    } catch (err) {
      console.error("Failed to create member:", err);
      alert("Failed to add member.");
    }
  }


  return (
    <Container className="py-4">

      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">
            Dashboard
          </h1>
        </div>

        <Button variant="primary" onClick={() => setShowModal(true)}>
          <PersonPlus className="me-2" />
          Add Member
        </Button>
      </div>

      {/* ================= STATS ROW ================= */}
      {/* ===== STATS STRIP ===== */}
      {members.length > 0 && (
        <div className="stats-strip mb-4">
          <Row className="text-center">

            <Col xs={6} md={3}>
              <div className="stat-item">
                <People size={24} className="text-success mb-1" />
                <h2>{members.length}</h2>
                <p>Members</p>
              </div>
            </Col>

            <Col xs={6} md={3}>
              <div className="stat-item">
                <Capsule size={24} className="text-success mb-1" />
                <h2>{activeMedications.length}</h2>
                <p>Active Medications</p>
              </div>
            </Col>

            <Col xs={6} md={3}>
              <div className="stat-item">
                <TelephoneFill size={24} className="text-danger mb-1" />
                <h2>{emergencyContacts.length}</h2>
                <p>Emergency Contacts</p>
              </div>
            </Col>

            <Col xs={6} md={3}>
              <div className="stat-item">
                <PersonBadge size={24} className="text-warning mb-1" />
                <h2>
                  {members.filter(m => calculateAge(m.date_of_birth) >= 60).length}
                </h2>
                <p>Seniors (60+)</p>
              </div>
            </Col>

          </Row>
        </div>
      )}
          {/* ================= UPCOMING APPOINTMENTS ================= */}
      {members.length > 0 && (
        <Card className="mb-4 shadow-sm border-0">
          <Card.Header className="fw-semibold d-flex justify-content-between align-items-center bg-light">
            <div className="d-flex align-items-center">
              <CalendarCheck className="me-2 text-primary" />
              <h1>Upcoming Appointments</h1>
            </div>
          </Card.Header>

        <Card.Body>
          {/* //for modal open */}
  <UpcomingAppointments
  familyId={familyId}
  refreshKey={refreshAppointments}
  onEditAppointment={(appt) => {
    setSelectedAppointment(appt);
    setShowAppointmentModal(true);
  }}
/>
</Card.Body>
        </Card>
      )}

      {/* ================= EMPTY STATE ================= */}
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
        <>
{/* ================= MEMBERS SECTION ================= */}
<Card className="mt-4 shadow-sm border-0">
  <Card.Header className="fw-semibold d-flex justify-content-between align-items-center bg-light">
    <div className="d-flex align-items-center">
      <PersonCircle className="me-2 text-primary" size={20} />
      <h1>Family Members</h1>
    </div>

    <span className="badge bg-primary rounded-pill px-3">
      {members.length}
    </span>
  </Card.Header>

  <Card.Body style={{ background: "#f8faff" }}>
    {members.length === 0 ? (
      <div className="text-muted text-center py-4">
        No family members found
      </div>
    ) : (
      <Row xs={1} md={2} lg={3} className="g-4">
        {members.map((member) => (
          <Col key={member.id}>
            <Card
              className="h-100 shadow-sm border-0 border-start border-4 border-primary member-card"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/members/${member.id}`)}
            >
              <Card.Body>

                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center">
                    <div className="me-3 text-primary">
                      <PersonCircle size={36} />
                    </div>
                    <div>
                      <Card.Title className="mb-0 fw-semibold">
                        {member.first_name} {member.last_name}
                      </Card.Title>
                      <small className="text-muted">
                        Age {calculateAge(member.date_of_birth)}
                      </small>
                    </div>
                  </div>

                  <span className="badge bg-primary-subtle text-primary border">
                    {member.gender}
                  </span>
                </div>

                {/* Additional Info */}
                <div className="small text-muted mb-3">
                  <Calendar className="me-1" />
                  DOB: {formatDate(member.date_of_birth)}
                </div>

                {/* Action */}
                <div className="d-flex justify-content-end">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/members/${member.id}`);
                    }}
                  >
                    View Profile
                  </Button>
                </div>

              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    )}
  </Card.Body>
</Card>
          {/* Active Medications */}
          <Card className="mt-4 shadow-sm border-0">
            <Card.Header className="fw-semibold d-flex justify-content-between align-items-center bg-light">
              <div className="d-flex align-items-center">
                <HeartPulse className="me-2 text-success" />
                <h1>Active Medications</h1>
              </div>
              <span className="badge bg-success rounded-pill px-3">
                {activeMedications.length}
              </span>
            </Card.Header>

            <Card.Body style={{ background: "#f8fff9" }}>
              {loadingMeds ? (
                <div className="text-muted text-center py-4">
                  Loading medications...
                </div>
              ) : activeMedications.length === 0 ? (
                <div className="text-muted text-center py-4">
                  No active medications
                </div>
              ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                  {activeMedications.map((med) => {
                    const timing = (() => {
                      if (!med.timing) return "-";

                      try {
                        const parsed = JSON.parse(med.timing);
                        return Array.isArray(parsed)
                          ? parsed.join(", ")
                          : med.timing;
                      } catch {
                        return med.timing;
                      }
                    })();

                    return (
                      <Col key={med.id}>
                        <Card className="h-100 shadow-sm border-0 border-start border-4 border-success">
                          <Card.Body>
                            {/* Medicine Name */}
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <Card.Title className="mb-0 fw-semibold text-success">
                                <Capsule className="me-2" />
                                {med.medicine_name}
                              </Card.Title>
                              <span className="badge bg-success-subtle text-success border">
                                Active
                              </span>
                            </div>

                            {/* Member */}
                            <div className="mb-2 text-muted small">
                              <Person className="me-1" />
                              {med.first_name} {med.last_name}
                            </div>

                            {/* Dosage + Frequency */}
                            <div className="mb-2 small">
                              <span className="badge bg-light text-dark me-2 border">
                                💊 {med.dosage}
                              </span>
                              <span className="badge bg-light text-dark border">
                                🔁 {med.frequency}
                              </span>
                            </div>

                            {/* Timing Badges */}
                            <div className="mb-3">
                              <Clock className="me-1 text-muted" />
                              {Array.isArray(timing) ? (
                                timing.map((t: string, i: number) => (
                                  <span
                                    key={i}
                                    className="badge bg-primary-subtle text-primary me-1 border"
                                  >
                                    {t.trim()}
                                  </span>
                                ))
                              ) : (
                                <span className="badge bg-primary-subtle text-primary border">
                                  {timing}
                                </span>
                              )}
                            </div>

                            {/* Duration */}
                            <div className="small text-muted">
                              <Calendar className="me-1" />
                              {formatDate(med.start_date)} → {formatDate(med.end_date)}
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              )}
            </Card.Body>
          </Card>

          {/* Emergency Contacts */}
          <Card className="mt-4 shadow-sm border-0">
            <Card.Header className="fw-semibold d-flex justify-content-between align-items-center bg-light">
              <div className="d-flex align-items-center">
                <TelephoneFill className="me-2 text-danger" />
                <h1>Emergency Contacts</h1>
              </div>
              <span className="badge bg-danger rounded-pill px-3">
                {emergencyContacts.length}
              </span>
            </Card.Header>

            <Card.Body style={{ background: "#fff5f5" }}>
              {loadingContacts ? (
                <div className="text-muted text-center py-4">
                  Loading contacts...
                </div>
              ) : emergencyContacts.length === 0 ? (
                <div className="text-muted text-center py-4">
                  No emergency contacts added
                </div>
              ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                  {emergencyContacts.map((contact) => (
                    <Col key={contact.id}>
                      <Card className="h-100 shadow-sm border-0 border-start border-4 border-danger">
                        <Card.Body>
                          {/* Name */}
                          <Card.Title className="fw-semibold text-danger mb-2">
                            <PersonFill className="me-2" />
                            {contact.name}
                          </Card.Title>

                          {/* Relationship */}
                          <div className="small text-muted mb-2">
                            <PeopleFill className="me-1" />
                            {contact.relationship}
                          </div>

                          {/* Phone */}
                          <div className="mb-2">
                            <Telephone className="me-1" />
                            <a
                              href={`tel:${contact.phone}`}
                              className="text-decoration-none"
                            >
                              {contact.phone}
                            </a>
                          </div>

                          {/* Optional Notes */}
                          {contact.notes && (
                            <div className="small text-muted">
                              {contact.notes}
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </>
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

      {/* Edit Appointment Modal */}
<Modal
  show={showAppointmentModal}
  onHide={() => setShowAppointmentModal(false)}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>Edit Appointment</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {selectedAppointment ? (
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Doctor</Form.Label>
          <Form.Control
            value={selectedAppointment.doctor_name}
            onChange={(e) =>
              setSelectedAppointment({
                ...selectedAppointment,
                doctor_name: e.target.value,
              })
            }
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Hospital</Form.Label>
          <Form.Control
            value={selectedAppointment.hospital_name}
            onChange={(e) =>
              setSelectedAppointment({
                ...selectedAppointment,
                hospital_name: e.target.value,
              })
            }
          />
        </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={
                    selectedAppointment.appointment_date
                      ? selectedAppointment.appointment_date.split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setSelectedAppointment({
                      ...selectedAppointment,
                      appointment_date: e.target.value,
                    })
                  }
                />
        </Form.Group>

        <Form.Group>
          <Form.Label>Reason</Form.Label>
          <Form.Control
            value={selectedAppointment.reason}
            onChange={(e) =>
              setSelectedAppointment({
                ...selectedAppointment,
                reason: e.target.value,
              })
            }
          />
        </Form.Group>
      </Form>
    ) : (
      <div>Loading...</div>
    )}
  </Modal.Body>

  <Modal.Footer>
    <Button variant="outline-secondary" onClick={() => setShowAppointmentModal(false)}>
      Cancel
    </Button>
    <Button
      variant="primary"
      onClick={async () => {
        try {
          await axios.put(
            `${API_BASE_URL}/appointments/${selectedAppointment.id}`,
            payload
          );
          setShowAppointmentModal(false);
          setRefreshAppointments(prev => prev + 1);
        
        } catch (err) {
          console.error(err);
          alert("Failed to update appointment");
        }
      }}
    >
      Save
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

    </Container>
  );
}
{/* Family Tree */ }
{/* <Card className="mt-4 shadow-sm">
  <Card.Header className="fw-semibold">
    Family Tree
  </Card.Header>

  <Card.Body style={{ height: 550 }}>
    {loadingTree && members.length>0 && relationships.length>0 ? (
      <div className="text-muted text-center py-5">
        Loading family tree...
      </div>
    ) : (
      <FamilyTree members={members} relationships={relationships} />
    )}
  </Card.Body>
</Card> */}