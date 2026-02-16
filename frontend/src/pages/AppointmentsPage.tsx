import { useEffect, useState } from "react";
import {
  Container,
  Button,
  Card,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import { CalendarPlus } from "react-bootstrap-icons";
import AppointmentCard from "../components/appointments/AppointmentCard";
import { fetchAllAppointments, createAppointment } from "../api/appointment.api";
import { fetchMembers } from "../api/members.api";
import { dataService } from "../services/data.service";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [members, setMembers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
   const [formData, setFormData] = useState({
  title: "",
  hospital: "",
  date: "",
  time: "",
  notes: "",
  memberId: ""
});
  const familyId = dataService.getSelectedFamily()

useEffect(() => {
  fetchAllAppointments(familyId)
    .then(setAppointments)
    .catch(() => setError("Failed to load appointments"))
    .finally(() => setLoading(false));

  fetchMembers(familyId)
    .then(setMembers)
    .catch(() => console.error("Failed to load members"));
}, []);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleChange = (e: any) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
const handleSave = async (e?: any) => {
  if (e) e.preventDefault();

  try {
    console.log("FormData:", formData); // Debug

    if (!formData.memberId || !formData.date || !formData.time) {
      alert("Member, Date and Time are required");
      return;
    }

    const appointmentDate = `${formData.date}T${formData.time}:00`;

    const newAppointment = await createAppointment({
      familyId,
      memberId: Number(formData.memberId),
      appointmentDate,
      hospitalName: formData.hospital,
      doctorName: formData.title,
      notes: formData.notes,
      reason: formData.notes,
      status: "scheduled"
    });

    setAppointments((prev) => [...prev, newAppointment]);
    setShowModal(false);

    setFormData({
      title: "",
      hospital: "",
      date: "",
      time: "",
      notes: "",
      memberId: ""
    });
     fetchAllAppointments(familyId)
    .then(setAppointments)
    .catch(() => setError("Failed to load appointments"))
    .finally(() => setLoading(false));

  } catch (err: any) {
    console.error("Create Appointment Error:", err);
    alert("Failed to create appointment. Check console.");
  }
};

  return (
    <Container className="py-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="d-flex align-items-center gap-2">
          📅 Appointments
        </h1>

        <Button variant="primary" onClick={handleShow}>
          <CalendarPlus className="me-2" />
          New Appointment
        </Button>
      </div>

      {/* CONTENT */}
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && appointments.length === 0 && (
        <Alert variant="info">No appointments found</Alert>
      )}

      {appointments.map((appt) => (
        <AppointmentCard key={appt.id} appointment={appt} />
      ))}

      {/* MODAL */}
    <Modal show={showModal} onHide={handleClose} centered>
  <Modal.Header closeButton>
    <Modal.Title>Add New Appointment</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <Form onSubmit={handleSave}>
      
      {/* Member */}
      <Form.Group className="mb-3">
        <Form.Label>Member</Form.Label>
        <Form.Select
          name="memberId"
          value={formData.memberId}
          onChange={handleChange}
          required
        >
          <option value="">Select Member</option>

          {members?.map((member: any) => (
            <option key={member.id} value={member.id}>
              {member.first_name+' '+member.last_name}
            </option>
          ))}

        </Form.Select>
      </Form.Group>

      {/* Title */}
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* Hospital */}
      <Form.Group className="mb-3">
        <Form.Label>Hospital</Form.Label>
        <Form.Control
          type="text"
          name="hospital"
          value={formData.hospital}
          onChange={handleChange}
        />
      </Form.Group>

      {/* Date */}
      <Form.Group className="mb-3">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* Time */}
      <Form.Group className="mb-3">
        <Form.Label>Time</Form.Label>
        <Form.Control
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* Notes */}
      <Form.Group className="mb-3">
        <Form.Label>Notes</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </Form.Group>

      {/* Buttons */}
      <div className="d-flex justify-content-end mt-3">
        <Button variant="secondary" onClick={handleClose} className="me-2">
          Cancel
        </Button>

        <Button variant="primary" type="submit">
          Save Appointment
        </Button>
      </div>

    </Form>
  </Modal.Body>
</Modal>
    </Container>
  );
}