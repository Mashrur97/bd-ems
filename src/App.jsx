import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Guest from "./pages/Guest";
import VoterLogin from "./pages/voter/VoterLogin";
import VoterDashboard from "./pages/voter/VoterDashboard";
import APO from "./pages/officers/APO";
import PO from "./pages/officers/PO";
import ARO from "./pages/officers/ARO";
import RO from "./pages/officers/RO";
import APODashboard from "./pages/officers/APODashboard";
import PODashboard from "./pages/officers/PODashboard";
import ARODashboard from "./pages/officers/ARODashboard";
import RODashboard from "./pages/officers/RODashboard";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/guest" element={<Guest />} />
      <Route path="/voter/login" element={<VoterLogin />} />
      <Route path="/voter/dashboard" element={<VoterDashboard />} />
      <Route path="/officer/apo" element={<APO />} />
      <Route path="/officer/po" element={<PO />} />
      <Route path="/officer/aro" element={<ARO />} />
      <Route path="/officer/ro" element={<RO />} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/officer/apo/dashboard" element={<APODashboard />} />
      <Route path="/officer/po/dashboard" element={<PODashboard />} />
      <Route path="/officer/aro/dashboard" element={<ARODashboard />} />
      <Route path="/officer/ro/dashboard" element={<RODashboard />} />
    </Routes>
  );
}
