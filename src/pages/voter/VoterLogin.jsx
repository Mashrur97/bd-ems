import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { VOTERS } from "../../data/mockData";
import toast from "react-hot-toast";
import LightRays from "../../reactbits/LightRays";
import { UserCheck, ChevronDown } from "lucide-react";

const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = Array.from({ length: 60 }, (_, i) => String(2006 - i));

function CustomSelect({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className="w-full px-3 py-3 rounded-xl bg-white/[0.07] border border-white/10 text-white text-sm outline-none focus:border-green-500/50 transition-all flex items-center justify-between"
      >
        <span className={value ? "text-white" : "text-white/30"}>{value || placeholder}</span>
        <ChevronDown size={14} className={`text-white/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden z-50 max-h-48 overflow-y-auto shadow-2xl">
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full px-3 py-2.5 text-left text-sm hover:bg-white/[0.07] transition-all ${value === opt ? "text-green-400 bg-green-500/10" : "text-white/70"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VoterLogin() {
  const navigate = useNavigate();
  const [nid, setNid] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const existingVoter = sessionStorage.getItem("currentVoter");
    const existingOfficer = sessionStorage.getItem("currentOfficer");
    if (existingVoter) navigate("/voter/dashboard");
    if (existingOfficer) {
      const o = JSON.parse(existingOfficer);
      toast.error(`Already logged in as ${o.name} (${o.role.toUpperCase()}). Logout first.`);
      navigate("/");
    }
  }, []);

  const handleLogin = () => {
    const dob = `${year}-${String(months.indexOf(month) + 1).padStart(2, "0")}-${day}`;
    const voter = VOTERS.find((v) => v.nid === nid && v.dob === dob);
    if (voter) {
      sessionStorage.setItem("currentVoter", JSON.stringify(voter));
      toast.success(`Welcome, ${voter.name}`);
      navigate("/voter/dashboard");
    } else {
      setError("NID or Date of Birth is incorrect. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#06090f] text-white flex items-center justify-center relative">
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#22c55e"
          raysSpeed={1}
          lightSpread={0.8}
          rayLength={2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          pulsating={false}
          fadeDistance={0.8}
          saturation={1}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1 }} className="w-96 p-10 bg-black/50 backdrop-blur border border-green-500/20 rounded-3xl">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white/70 text-xs mb-7 hover:text-white transition-all bg-white/10 border border-white/15 px-3 py-2 rounded-lg backdrop-blur"
        >← Back</button>

        <div className="text-center mb-8">
          <div className="mb-3 flex justify-center">
            <UserCheck size={52} className="text-green-400" />
          </div>
          <div className="text-2xl font-bold">Voter Login</div>
          <div className="text-xs text-white/30 mt-1">ভোটার যাচাইকরণ</div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] tracking-widest text-white/30 block mb-2">NATIONAL ID (NID)</label>
            <input
              value={nid}
              onChange={(e) => { setNid(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="13-digit NID number"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.07] border border-white/10 text-white text-sm outline-none focus:border-green-500/50 transition-all placeholder:text-white/20"
            />
          </div>

          <div>
            <label className="text-[10px] tracking-widest text-white/30 block mb-2">DATE OF BIRTH</label>
            <div className="grid grid-cols-3 gap-2">
              <CustomSelect options={days} value={day} onChange={(v) => { setDay(v); setError(""); }} placeholder="Day" />
              <CustomSelect options={months} value={month} onChange={(v) => { setMonth(v); setError(""); }} placeholder="Month" />
              <CustomSelect options={years} value={year} onChange={(v) => { setYear(v); setError(""); }} placeholder="Year" />
            </div>
          </div>

          <div className="text-[10px] text-white/20 text-center py-1">
            Demo: <b className="text-white/40">1234567890123</b> · <b className="text-white/40">12 / March / 1985</b>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-sm hover:brightness-110 hover:-translate-y-0.5 transition-all mt-1"
          >Verify & Enter →</button>
        </div>
      </div>
    </div>
  );
}