import { Card, Badge } from "react-bootstrap";
import { Person, Hospital, Calendar, JournalText } from "react-bootstrap-icons";
interface Props {
  appointment: any;
}

export default function AppointmentCard({ appointment }: Props) {
  const getStatusVariant = () => {
    switch (appointment.status) {
      case "scheduled":
        return "success";
      case "completed":
        return "secondary";
      case "cancelled":
        return "danger";
      default:
        return "primary";
    }
  };

    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                    <Card.Title className="d-flex align-items-center gap-2">
                        <Person size={20} />
                        {appointment.first_name} {appointment.last_name}
                    </Card.Title>
                    <Badge bg={getStatusVariant()}>{appointment.status}</Badge>
                </div>
                <Card.Text className="mt-2">
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <Person size={16} className="text-primary" />
                        <strong>Doctor:</strong> {appointment.doctor_name}
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <Hospital size={16} className="text-success" />
                        <strong>Hospital:</strong> {appointment.hospital_name}
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <Calendar size={16} className="text-warning" />
                        <strong>Date:</strong> {new Date(appointment.appointment_date).toLocaleString()}
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <JournalText size={16} className="text-secondary" />
                        <strong>Reason:</strong> {appointment.reason || "-"}
                    </div>
                </Card.Text>
            </Card.Body>
        </Card>
    );
}