import OfficerLogin from "../../components/OfficerLogin";
import { ClipboardList } from "lucide-react";
export default function ARO() {
  return (
    <OfficerLogin
      role="aro"
      title="Asst. Returning Officer"
      subtitle="Constituency compilation"
      icon={<ClipboardList size={48} className="text-purple-400" />}
      accentColor="#9b59b6"
      redirectTo="/officer/aro/dashboard"
      demo={{ id: "ARO001", pin: "3333" }}
    />
  );
}
