import OfficerLogin from "../../components/OfficerLogin";

export default function ARO() {
  return (
    <OfficerLogin
      role="aro"
      title="Asst. Returning Officer"
      subtitle="Constituency compilation"
      icon="📋"
      accentColor="#9b59b6"
      redirectTo="/officer/aro/dashboard"
      demo={{ id: "ARO001", pin: "3333" }}
    />
  );
}