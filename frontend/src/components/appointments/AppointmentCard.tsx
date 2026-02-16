import { Card, Badge } from "react-bootstrap";

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
        <div className="d-flex justify-content-between">
          <Card.Title>
            {appointment.first_name} {appointment.last_name}
          </Card.Title>
          <Badge bg={getStatusVariant()}>
            {appointment.status}
          </Badge>
        </div>

        <Card.Text>
          <strong>Doctor:</strong> {appointment.doctor_name} <br />
          <strong>Hospital:</strong> {appointment.hospital_name} <br />
          <strong>Date:</strong>{" "}
          {new Date(appointment.appointment_date).toLocaleString()} <br />
          <strong>Reason:</strong> {appointment.reason}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}