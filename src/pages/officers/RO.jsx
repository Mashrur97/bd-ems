import OfficerLogin from "../../components/OfficerLogin";
import { Scale } from "lucide-react";
export default function RO() {
  return (
    <OfficerLogin
      role="ro"
      title="Returning Officer"
      subtitle="Final constituency approval"
      icon={<Scale size={48} className="text-red-400" />}
      accentColor="#e74c3c"
      redirectTo="/officer/ro/dashboard"
      demo={{ id: "RO001", pin: "4444" }}
    />
  );
}
