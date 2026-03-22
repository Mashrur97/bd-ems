import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { LogOut, User, Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar({ title, subtitle, rightContent, backTo }) {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [loggedIn, setLoggedIn] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    const voter = sessionStorage.getItem("currentVoter");
    const officer = sessionStorage.getItem("currentOfficer");
    if (voter) setLoggedIn({ type: "voter", data: JSON.parse(voter) });
    else if (officer) setLoggedIn({ type: "officer", data: JSON.parse(officer) });
    return () => clearInterval(t);
  }, []);

  // close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    toast.success("Logged out successfully");
    setLoggedIn(null);
    setDropdownOpen(false);
    navigate("/");
  };

  const roleLabel = {
    apo: "Asst. Presiding Officer",
    po: "Presiding Officer",
    aro: "Asst. Returning Officer",
    ro: "Returning Officer",
  };

  const accentColor = loggedIn?.type === "voter" ? "#22c55e" : "#e8b84b";
  const accentBg = loggedIn?.type === "voter" ? "rgba(34,197,94,0.15)" : "rgba(232,184,75,0.15)";
  const accentBorder = loggedIn?.type === "voter" ? "rgba(34,197,94,0.35)" : "rgba(232,184,75,0.35)";
  const roleText = loggedIn?.type === "voter" ? "VOTER" : roleLabel[loggedIn?.data?.role]?.split(" ")[0].toUpperCase();
  const initials = loggedIn?.data?.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="sticky top-0 z-50 bg-white/[0.05] border-b border-white/10 backdrop-blur-xl px-4 md:px-10 py-3 flex justify-between items-center gap-2">
      {/* left — logo */}
      <div
        className="flex items-center gap-2 md:gap-3 min-w-0 cursor-pointer hover:opacity-70 transition-opacity flex-shrink-0"
        onClick={() => navigate("/")}
      >
        <img src="/favicon.svg" alt="BD" className="w-7 h-7 flex-shrink-0" />
        <div className="min-w-0">
          <div className="text-[10px] md:text-xs font-bold text-yellow-400 tracking-widest truncate">
            {title || "BANGLADESH ELECTION COMMISSION"}
          </div>
          <div className="text-[9px] md:text-[10px] text-white/50 truncate">
            {subtitle || "বাংলাদেশ নির্বাচন কমিশন · EMS v2.0"}
          </div>
        </div>
      </div>

      {/* middle — breadcrumb */}
      {(title || subtitle) && (
        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.07]">
          {title && <span className="text-[10px] text-white/50 tracking-widest font-medium">{title}</span>}
          {subtitle && <>
            <span className="text-white/20 text-[10px]">·</span>
            <span className="text-[10px] text-white/30">{subtitle}</span>
          </>}
        </div>
      )}

      {/* right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {rightContent}

        <span className="font-mono text-xs text-white/60 hidden lg:block">
          {time.toLocaleTimeString("en-BD")}
        </span>

        {loggedIn && (
          <div className="relative" ref={dropdownRef}>
            {/* desktop badge */}
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer hover:opacity-80 transition-all"
              style={{ background: accentBg, borderColor: accentBorder }}
              onClick={() => setDropdownOpen(p => !p)}
            >
              {loggedIn.type === "voter"
                ? <User size={13} style={{ color: accentColor }} />
                : <Shield size={13} style={{ color: accentColor }} />
              }
              <span className="text-xs text-white/70 max-w-[120px] truncate">{loggedIn.data.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold" style={{ background: accentBg, color: accentColor }}>
                {roleText}
              </span>
            </div>

            {/* mobile avatar */}
            <div
              className="flex md:hidden items-center justify-center w-8 h-8 rounded-full text-[11px] font-bold cursor-pointer hover:opacity-80 transition-all"
              style={{ background: accentBg, color: accentColor, border: `1px solid ${accentBorder}` }}
              onClick={() => setDropdownOpen(p => !p)}
            >
              {initials}
            </div>

            {/* dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 top-11 w-52 bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-white/10">
                  <div className="text-sm font-bold truncate">{loggedIn.data.name}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: accentColor }}>{roleText}</div>
                  {loggedIn.data.id && (
                    <div className="text-[10px] text-white/30 mt-0.5">{loggedIn.data.id}</div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 text-sm hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        )}

        {backTo && !loggedIn && (
          <button
            onClick={() => navigate(backTo)}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs hover:bg-white/10 transition-all"
          >← Back</button>
        )}
      </div>
    </div>
  );
}