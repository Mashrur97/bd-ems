import OfficerLogin from "../../components/OfficerLogin";
import { PenLine } from "lucide-react";
export default function APO() {
  return (
    <OfficerLogin
      role="apo"
      title="Asst. Presiding Officer"
      subtitle="Booth vote entry portal"
      icon={<PenLine size={48} className="text-yellow-400" />}
      accentColor="#e8b84b"
      redirectTo="/officer/apo/dashboard"
      demo={{ id: "APO001", pin: "1111" }}
    />
  );
}
