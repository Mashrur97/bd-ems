import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar({ title, subtitle, rightContent, backTo }) {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-black/80 border-b border-white/15 backdrop-blur-md px-4 md:px-10 py-3 flex justify-between items-center gap-2">
      <div
        className="flex items-center gap-2 md:gap-3 min-w-0 cursor-pointer hover:opacity-70 transition-opacity"
        onClick={() => navigate("/")}
      >
        <span className="text-xl md:text-2xl flex-shrink-0">🇧🇩</span>
        <div className="min-w-0">
          <div className="text-[10px] md:text-xs font-bold text-yellow-400 tracking-widest truncate">
            {title || "BANGLADESH ELECTION COMMISSION"}
          </div>
          <div className="text-[9px] md:text-[10px] text-white/50 truncate">
            {subtitle || "বাংলাদেশ নির্বাচন কমিশন · EMS v2.0"}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {rightContent}
        <span className="font-mono text-xs text-white/60 hidden lg:block">
          {time.toLocaleTimeString("en-BD")}
        </span>
        {backTo && (
          <button
            onClick={() => navigate(backTo)}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs hover:bg-white/10 transition-all"
          >← Back</button>
        )}
      </div>
    </div>
  );
}