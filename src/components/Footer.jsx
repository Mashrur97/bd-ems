import { Github, Globe, Shield, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <div className="border-t border-white/10 bg-black/40 backdrop-blur mt-10">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

          {/* brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/favicon.svg" alt="BD" className="w-8 h-8" />
              <div>
                <div className="text-sm font-bold text-yellow-400 tracking-widest">BANGLADESH ELECTION COMMISSION</div>
                <div className="text-[10px] text-white/30">বাংলাদেশ নির্বাচন কমিশন</div>
              </div>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              Digital Election Management System — built to digitize and modernize Bangladesh's national parliamentary election process.
            </p>
          </div>

          {/* project info */}
          <div>
            <div className="text-[10px] tracking-widest text-white/30 mb-4">PROJECT INFO</div>
            <div className="flex flex-col gap-2 text-xs text-white/40">
              {[
                { icon: <Shield size={12} />, text: "CSE327 — Software Engineering" },
                { icon: <Globe size={12} />, text: "North South University" },
                { icon: <ShieldCheck size={12} />, text: "Spring 2026" },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-2">
                  {item.icon} {item.text}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://github.com/Mashrur97/bd-ems" target="_blank" className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-all">
                <Github size={13} /> GitHub
              </a>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="border-t border-white/[0.07] pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-xs text-white/20">
            © 2026 Bangladesh Election Commission · EMS
          </div>
          <div className="flex items-center gap-2 text-xs text-white/20">
            <Shield size={11} /> Digital Bangladesh Vision 2077
          </div>
        </div>
      </div>
    </div>
  );
}