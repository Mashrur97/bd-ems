import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut, User, Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar({ title, subtitle, rightContent, backTo }) {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    const voter = sessionStorage.getItem("currentVoter");
    const officer = sessionStorage.getItem("currentOfficer");
    if (voter) setLoggedIn({ type: "voter", data: JSON.parse(voter) });
    else if (officer) setLoggedIn({ type: "officer", data: JSON.parse(officer) });
    return () => clearInterval(t);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    toast.success("Logged out successfully");
    setLoggedIn(null);
    navigate("/");
  };

  const roleLabel = {
    apo: "Asst. Presiding Officer",
    po: "Presiding Officer",
    aro: "Asst. Returning Officer",
    ro: "Returning Officer",
  };

  return (
    <div className="sticky top-0 z-50 bg-black/80 border-b border-white/15 backdrop-blur-md px-4 md:px-10 py-3 flex justify-between items-center gap-2">
      {/* left — logo */}
      <div
        className="flex items-center gap-2 md:gap-3 min-w-0 cursor-pointer hover:opacity-70 transition-opacity flex-shrink-0"
        onClick={() => navigate("/")}
      >
        <img src="/favicon.svg" alt="BD" className="w-7 h-7 flex-shrink-0" />
        <div className="min-w-0 hidden sm:block">
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
          {title && (
            <span className="text-[10px] text-white/50 tracking-widest font-medium">{title}</span>
          )}
          {subtitle && (
            <>
              <span className="text-white/20 text-[10px]">·</span>
              <span className="text-[10px] text-white/30">{subtitle}</span>
            </>
          )}
        </div>
      )}

      {/* right — user info + clock + logout */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {loggedIn && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            {loggedIn.type === "voter"
              ? <User size={13} className="text-green-400" />
              : <Shield size={13} className="text-yellow-400" />
            }
            <span className="text-xs text-white/60 max-w-[120px] truncate">
              {loggedIn.data.name}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold"
              style={{
                background: loggedIn.type === "voter" ? "rgba(34,197,94,0.15)" : "rgba(232,184,75,0.15)",
                color: loggedIn.type === "voter" ? "#22c55e" : "#e8b84b"
              }}>
              {loggedIn.type === "voter" ? "VOTER" : roleLabel[loggedIn.data.role]?.split(" ")[0].toUpperCase()}
            </span>
          </div>
        )}

        {rightContent}

        <span className="font-mono text-xs text-white/60 hidden lg:block">
          {time.toLocaleTimeString("en-BD")}
        </span>

        {loggedIn && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-xs hover:bg-red-500/20 transition-all"
          >
            <LogOut size={13} /> Logout
          </button>
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