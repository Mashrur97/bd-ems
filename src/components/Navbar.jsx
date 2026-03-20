import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useElection } from "../store/ElectionContext";

export default function Navbar({ title, subtitle, rightContent, backTo }) {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-black/60 border-b border-white/10 backdrop-blur px-6 md:px-10 py-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🇧🇩</span>
        <div>
          <div className="text-xs font-bold text-yellow-400 tracking-widest">
            {title || "BANGLADESH ELECTION COMMISSION"}
          </div>
          <div className="text-[10px] text-white/30">
            {subtitle || "বাংলাদেশ নির্বাচন কমিশন · EMS v2.0"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {rightContent}
        <span className="font-mono text-xs text-white/30 hidden md:block">
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