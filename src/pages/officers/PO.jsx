import OfficerLogin from "../../components/OfficerLogin";
import { ShieldCheck } from "lucide-react";

export default function PO() {
  return (
    <OfficerLogin
      role="po"
      title="Presiding Officer"
      subtitle="Station result verification"
      icon={<ShieldCheck size={48} className="text-orange-400" />}
      accentColor="#e67e22"
      redirectTo="/officer/po/dashboard"
      demo={{ id: "PO001", pin: "2222" }}
    />
  );
}
