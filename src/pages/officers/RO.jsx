import OfficerLogin from "../../components/OfficerLogin";

export default function RO() {
  return (
    <OfficerLogin
      role="ro"
      title="Returning Officer"
      subtitle="Final constituency approval"
      icon="⚖️"
      accentColor="#e74c3c"
      redirectTo="/officer/ro/dashboard"
      demo={{ id: "RO001", pin: "4444" }}
    />
  );
}