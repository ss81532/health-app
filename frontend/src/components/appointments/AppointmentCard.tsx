import { Card, Badge, Button } from "react-bootstrap";
import { Person, Hospital, Calendar, JournalText, Pencil, Trash } from "react-bootstrap-icons";
import { deleteAppointment } from "../../api/appointment.api";

interface Props {
  appointment: {
    id: number;
    first_name?: string;
    last_name?: string;
    doctor_name?: string;
    hospital_name?: string;
    appointment_date?: string;
    reason?: string;
    status?: string;
  };
  onEdit: (appt: any) => void;   // Callback to open edit modal
  onDeleted: () => void;          // Callback to refresh parent
}

export default function AppointmentCard({ appointment, onEdit, onDeleted }: Props) {
  // Determine badge color based on status
  const getStatusVariant = () => {
    switch (appointment.status) {
      case "completed":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "primary";
    }
  };

  const handleEdit = async (appointment:any) =>{
    try {
     onEdit(appointment)
    } catch (error) {
      console.error("Failed to refresh appointment:", error);
    }
  }

  // Delete appointment with confirmation
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;

    try {
      await deleteAppointment(appointment.id);
      onDeleted(); // refresh parent list
    } catch (err) {
      console.error("Failed to delete appointment:", err);
      alert("Failed to delete appointment. Check console.");
    }
  };

  return (
    <Card className="mb-3 shadow-sm h-100">
      <Card.Body>
        {/* Header: Name + Status */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title className="d-flex align-items-center gap-2 mb-0">
            <Person size={20} />
            {appointment.first_name || "-"} {appointment.last_name || "-"}
          </Card.Title>
          <Badge bg={getStatusVariant()}>
            {appointment.status || "scheduled"}
          </Badge>
        </div>

        {/* Appointment Info */}
        <Card.Text className="mb-3">
          <div className="d-flex align-items-center gap-2 mb-1">
            <Person size={16} className="text-primary" />
            <strong>Doctor:</strong> {appointment.doctor_name || "-"}
          </div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <Hospital size={16} className="text-success" />
            <strong>Hospital:</strong> {appointment.hospital_name || "-"}
          </div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <Calendar size={16} className="text-warning" />
            <strong>Date:</strong>{" "}
            {appointment.appointment_date
              ? new Date(appointment.appointment_date).toLocaleString()
              : "-"}
          </div>
          <div className="d-flex align-items-center gap-2">
            <JournalText size={16} className="text-secondary" />
            <strong>Reason:</strong> {appointment.reason || "-"}
          </div>
        </Card.Text>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleEdit(appointment)}
            style={{ cursor: "pointer" }}
          >
            <Pencil size={16} className="me-1" /> Edit
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleDelete}
            style={{ cursor: "pointer" }}
          >
            <Trash size={16} className="me-1" /> Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}