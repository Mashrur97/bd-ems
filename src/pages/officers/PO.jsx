import OfficerLogin from "../../components/OfficerLogin";

export default function PO() {
  return (
    <OfficerLogin
      role="po"
      title="Presiding Officer"
      subtitle="Station result verification"
      icon="🏛️"
      accentColor="#e67e22"
      redirectTo="/officer/po/dashboard"
      demo={{ id: "PO001", pin: "2222" }}
    />
  );
}