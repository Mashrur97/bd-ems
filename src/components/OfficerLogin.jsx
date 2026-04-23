import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LightRays from "../reactbits/LightRays";
import toast from "react-hot-toast";
import api from "../api";

export default function OfficerLogin({ role, title, subtitle, icon, accentColor, redirectTo, demo }) {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const existingOfficer = sessionStorage.getItem("currentOfficer");
    const existingVoter = sessionStorage.getItem("currentVoter");
    if (existingOfficer) {
      const o = JSON.parse(existingOfficer);
      if (o.role === role) navigate(redirectTo);
      else { toast.error(`Already logged in as ${o.name} (${o.role.toUpperCase()}). Logout first.`); navigate("/"); }
    }
    if (existingVoter) {
      const v = JSON.parse(existingVoter);
      toast.error(`Already logged in as voter ${v.name}. Logout first.`);
      navigate("/");
    }
  }, []);

  const handleLogin = async () => {
    if (!id || !pin) { setError("Please enter Officer ID and PIN."); return; }
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/api/officer/login", { officerId: id, pin, role });
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("currentOfficer", JSON.stringify(data.officer));
      toast.success(`Welcome, ${data.officer.name}`);
      navigate(redirectTo);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Officer ID or PIN.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06090f] text-white flex items-center justify-center relative">
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <LightRays raysOrigin="top-center" raysColor={accentColor} raysSpeed={1} lightSpread={0.8} rayLength={2} followMouse={true} mouseInfluence={0.1} noiseAmount={0} distortion={0} pulsating={false} fadeDistance={0.8} saturation={1} />
      </div>

      <div style={{ position: "relative", zIndex: 1, borderColor: accentColor + "33" }} className="w-96 p-10 bg-black/50 backdrop-blur rounded-3xl border">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/70 text-xs mb-7 hover:text-white transition-all bg-white/10 border border-white/15 px-3 py-2 rounded-lg">← Back</button>

        <div className="text-center mb-8">
          <div className="mb-3 flex justify-center">{icon}</div>
          <div className="text-2xl font-bold">{title}</div>
          <div className="text-xs text-white/30 mt-1">{subtitle}</div>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-4">{error}</div>}

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] tracking-widest text-white/30 block mb-2">OFFICER ID</label>
            <input value={id} onChange={(e) => { setId(e.target.value); setError(""); }} onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder={demo.id} className="w-full px-4 py-3 rounded-xl bg-white/[0.07] border border-white/10 text-white text-sm outline-none transition-all placeholder:text-white/20" />
          </div>
          <div>
            <label className="text-[10px] tracking-widest text-white/30 block mb-2">PIN</label>
            <input type="password" value={pin} onChange={(e) => { setPin(e.target.value); setError(""); }} onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder="••••" className="w-full px-4 py-3 rounded-xl bg-white/[0.07] border border-white/10 text-white text-sm outline-none transition-all placeholder:text-white/20" />
          </div>
          <div className="text-[10px] text-white/20 text-center py-1">Demo: <b className="text-white/40">{demo.id}</b> · <b className="text-white/40">{demo.pin}</b></div>
          <button onClick={handleLogin} disabled={loading} className="w-full py-3.5 rounded-xl text-white font-bold text-sm hover:brightness-110 hover:-translate-y-0.5 transition-all mt-1 disabled:opacity-50" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }}>
            {loading ? "Logging in..." : "Login →"}
          </button>
        </div>
      </div>
    </div>
  );
}
