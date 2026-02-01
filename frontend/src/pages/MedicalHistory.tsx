import { useParams } from "react-router-dom";

export default function MedicalHistory() {
  const { memberId } = useParams();

  return <h1>Medical History for Member {memberId}</h1>;
}
