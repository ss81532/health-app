import { useEffect, useState } from "react";
import { Spinner, Alert, Col, Row } from "react-bootstrap";
import AppointmentCard from "./AppointmentCard";
import { fetchUpcomingAppointments } from "../../api/appointment.api";

interface Props {
  familyId: number;
  onEditAppointment: (appt: any) => void; // Callback to open edit modal
  onDeleted?: () => void; 
  refreshKey: number               // Optional refresh callback
}

export default function UpcomingAppointments({ familyId, onEditAppointment, onDeleted, refreshKey }: Props) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

   const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await fetchUpcomingAppointments(familyId);
      setAppointments(data);
    } catch (error) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadAppointments();
  }, [familyId,refreshKey]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (appointments.length === 0) return <Alert variant="info">No upcoming appointments</Alert>;

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {appointments.map((appt) => (
        <Col key={appt.id}>
          <AppointmentCard
            appointment={appt}
            onEdit={() => {
              onEditAppointment(appt)
            }} // parent handles modal
            onDeleted={() => {
              loadAppointments();                // refresh list after delete
              onDeleted?.();                      // optional parent callback
            }}
          />
        </Col>
      ))}
    </Row>
  );
}