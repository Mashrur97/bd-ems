import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OFFICERS } from "../data/mockData";
import Navbar from "./Navbar";
import Footer from "./Footer";
import toast from "react-hot-toast";

export default function OfficerLogin({
  role,
  title,
  subtitle,
  icon,
  accentColor,
  redirectTo,
  demo,
}) {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // already logged in as this role → redirect to dashboard
    const existingOfficer = sessionStorage.getItem("currentOfficer");
    const existingVoter = sessionStorage.getItem("currentVoter");

    if (existingOfficer) {
      const o = JSON.parse(existingOfficer);
      if (o.role === role) {
        navigate(redirectTo);
      } else {
        toast.error(
          `Already logged in as ${o.name} (${o.role.toUpperCase()}). Logout first.`,
        );
        navigate("/");
      }
    }

    if (existingVoter) {
      const v = JSON.parse(existingVoter);
      toast.error(`Already logged in as voter ${v.name}. Logout first.`);
      navigate("/");
    }
  }, []);

  const handleLogin = () => {
    const officer = OFFICERS.find(
      (o) => o.id === id && o.pin === pin && o.role === role,
    );
    if (officer) {
      sessionStorage.setItem("currentOfficer", JSON.stringify(officer));
      toast.success(`Welcome, ${officer.name}`);
      navigate(redirectTo);
    } else {
      setError("Invalid Officer ID or PIN.");
    }
  };

  return (
    <div className="min-h-screen bg-[#06090f] text-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4">
        <div
          className="w-96 p-10 bg-white/[0.04] rounded-3xl border"
          style={{ borderColor: accentColor + "33" }}
        >
          <button
            onClick={() => navigate("/")}
            className="text-white/30 text-xs mb-7 hover:text-white/60 transition-all"
          >
            ← Back
          </button>

          <div className="text-center mb-8">
            <div className="text-5xl mb-3">{icon}</div>
            <div className="text-2xl font-bold">{title}</div>
            <div className="text-xs text-white/30 mt-1">{subtitle}</div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-4">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] tracking-widest text-white/30 block mb-2">
                OFFICER ID
              </label>
              <input
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                  setError("");
                }}
                placeholder={demo.id}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.07] border border-white/10 text-white text-sm outline-none transition-all placeholder:text-white/20"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-widest text-white/30 block mb-2">
                PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError("");
                }}
                placeholder="••••"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.07] border border-white/10 text-white text-sm outline-none transition-all placeholder:text-white/20"
              />
            </div>

            <div className="text-[10px] text-white/20 text-center py-1">
              Demo: <b className="text-white/40">{demo.id}</b> ·{" "}
              <b className="text-white/40">{demo.pin}</b>
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm hover:brightness-110 hover:-translate-y-0.5 transition-all mt-1"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)`,
              }}
            >
              Login →
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
