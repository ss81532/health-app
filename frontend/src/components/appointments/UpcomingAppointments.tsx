import { useEffect, useState } from "react";
import { Spinner, Alert, Col, Row } from "react-bootstrap";
import AppointmentCard from "./AppointmentCard";
import { fetchUpcomingAppointments } from "../../api/appointment.api";

interface Props {
  familyId: number;
}

export default function UpcomingAppointments({ familyId }: Props) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUpcomingAppointments(familyId)
      .then(setAppointments)
      .catch(() => setError("Failed to load appointments"))
      .finally(() => setLoading(false));
  }, [familyId]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (appointments.length === 0)
    return <Alert variant="info">No upcoming appointments</Alert>;

  return (
    <>
       <Row xs={1} md={2} lg={3} className="g-4">
      {appointments.map((appt) => (
        <Col key={appt.id}>
          <AppointmentCard appointment={appt} />
        </Col>
      ))}
    </Row>
    </>
  );
}