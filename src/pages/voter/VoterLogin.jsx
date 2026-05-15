import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LightRays from "../../reactbits/LightRays";
import { UserCheck, ChevronDown, Search, MapPin, Loader2 } from "lucide-react";
import api from "../../api";

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

  // search state
  const [searchNid, setSearchNid] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");

  // login state
  const [nid, setNid] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSearch = async () => {
    if (!searchNid.trim()) { setSearchError("Enter your NID to search."); return; }
    setSearching(true);
    setSearchError("");
    setSearchResult(null);
    try {
      const { data } = await api.get(`/api/voter/search?nid=${searchNid.trim()}`);
      setSearchResult(data);
    } catch (err) {
      setSearchError(err.response?.data?.message || "No voter found with this NID.");
    } finally {
      setSearching(false);
    }
  };

  const handleLogin = async () => {
    if (!nid || !day || !month || !year) { setLoginError("Please fill in all fields."); return; }
    const dob = `${year}-${String(months.indexOf(month) + 1).padStart(2, "0")}-${day}`;
    setLoading(true);
    setLoginError("");
    try {
      const { data } = await api.post("/api/voter/login", { nid, dob });
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("currentVoter", JSON.stringify(data.voter));
      toast.success(`Welcome, ${data.voter.name}`);
      navigate("/voter/dashboard");
    } catch (err) {
      setLoginError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06090f] text-white flex items-center justify-center relative px-4 py-10">
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <LightRays raysOrigin="top-center" raysColor="#22c55e" raysSpeed={1} lightSpread={0.8} rayLength={2} followMouse={true} mouseInfluence={0.1} noiseAmount={0} distortion={0} pulsating={false} fadeDistance={0.8} saturation={1} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }} className="w-full max-w-md">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/70 text-xs mb-5 hover:text-white transition-all bg-white/10 border border-white/15 px-3 py-2 rounded-lg backdrop-blur">← Back</button>

        {/* ── BOOTH FINDER ─────────────────────────────────────────── */}
        <div className="bg-black/50 backdrop-blur border border-green-500/20 rounded-3xl p-8 mb-4">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <MapPin size={44} className="text-green-400" />
            </div>
            <div className="text-xl font-bold">Find Your Polling Station</div>
            <div className="text-xs text-white/30 mt-1">আপনার ভোট কেন্দ্র খুঁজুন</div>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              value={searchNid}
              onChange={(e) => { setSearchNid(e.target.value); setSearchError(""); setSearchResult(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter your NID number"
              className="flex-1 px-4 py-3 rounded-xl bg-white/[0.07] border border-white/10 text-white text-sm outline-none focus:border-green-500/50 transition-all placeholder:text-white/20"
            />
            <button
              onClick={handleSearch}
              disabled={searching}
              className="px-4 py-3 rounded-xl bg-green-600 hover:bg-green-500 transition-all disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
            >
              {searching
                ? <Loader2 size={16} className="animate-spin" />
                : <Search size={16} />
              }
            </button>
          </div>

          {searchError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {searchError}
            </div>
          )}

          {searching && (
            <div className="flex items-center justify-center gap-2 py-6 text-white/30 text-sm">
              <Loader2 size={18} className="animate-spin" /> Looking up voter record...
            </div>
          )}

          {searchResult && (
            <div className="bg-green-500/[0.07] border border-green-500/20 rounded-2xl p-4 mt-2">
              <div className="text-xs text-green-400 tracking-widest mb-3">VOTER FOUND</div>
              <div className="text-base font-bold text-white mb-3">{searchResult.name}</div>
              <div className="flex flex-col gap-2">
                {[
                  ["Polling Station", searchResult.stationName],
                  ["Booth ID", `Booth ${searchResult.boothId}`],
                  ["District", searchResult.district],
                  ["Constituency", `ID ${searchResult.constituencyId}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span className="text-white/30">{k}</span>
                    <span className="text-white/70 font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-[10px] text-white/20 text-center mt-4">
            Demo NID: <b className="text-white/40">1234567890123</b>
          </div>
        </div>

        {/* ── VOTER LOGIN ──────────────────────────────────────────── */}
        <div className="bg-black/40 backdrop-blur border border-white/10 rounded-3xl p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <UserCheck size={36} className="text-white/40" />
            </div>
            <div className="text-base font-bold text-white/60">Voter Account Login</div>
            <div className="text-xs text-white/20 mt-1">For incident reporting & vote slip</div>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-4">{loginError}</div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] tracking-widest text-white/30 block mb-2">NATIONAL ID (NID)</label>
              <input
                value={nid}
                onChange={(e) => { setNid(e.target.value); setLoginError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="13-digit NID number"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.07] border border-white/10 text-white text-sm outline-none focus:border-green-500/50 transition-all placeholder:text-white/20"
              />
            </div>

            <div>
              <label className="text-[10px] tracking-widest text-white/30 block mb-2">DATE OF BIRTH</label>
              <div className="grid grid-cols-3 gap-2">
                <CustomSelect options={days} value={day} onChange={(v) => { setDay(v); setLoginError(""); }} placeholder="Day" />
                <CustomSelect options={months} value={month} onChange={(v) => { setMonth(v); setLoginError(""); }} placeholder="Month" />
                <CustomSelect options={years} value={year} onChange={(v) => { setYear(v); setLoginError(""); }} placeholder="Year" />
              </div>
            </div>

            <div className="text-[10px] text-white/20 text-center py-1">
              Demo: <b className="text-white/40">1234567890123</b> · <b className="text-white/40">1 / January / 2006</b>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-sm hover:brightness-110 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >{loading ? "Verifying..." : "Login →"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}