import OfficerLogin from "../../components/OfficerLogin";

export default function APO() {
  return (
    <OfficerLogin
      role="apo"
      title="Asst. Presiding Officer"
      subtitle="Booth vote entry portal"
      icon="📝"
      accentColor="#e8b84b"
      redirectTo="/officer/apo/dashboard"
      demo={{ id: "APO001", pin: "1111" }}
    />
  );
}