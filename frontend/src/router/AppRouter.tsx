import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Families from "../pages/Families";
import MedicalHistory from "../pages/MedicalHistory";
import MemberDetails from "../components/MemberDetails";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/families" />} />

        <Route path="/families" element={<Families />} />
        <Route path="/dashboard/:familyId" element={<Dashboard />} />
        <Route path="/medical-history/:memberId" element={<MedicalHistory />} />
        <Route path="/members/:memberId" element={<MemberDetails />} />

        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
