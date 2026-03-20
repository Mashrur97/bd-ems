import { useNavigate } from "react-router-dom";
import { useElection } from "../store/ElectionContext";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Landing() {
  const navigate = useNavigate();
  const { totalVotes, turnout } = useElection();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const portals = [
    {
      icon: "📺",
      title: "Live Results",
      subtitle: "সরাসরি ফলাফল · Guest Mode",
      desc: "Real-time national vote count. No login needed.",
      link: "/guest",
      border: "border-blue-500/20",
      bg: "hover:bg-blue-500/10",
      text: "text-blue-400",
    },
    {
      icon: "🗳️",
      title: "Voter Portal",
      subtitle: "ভোটার পোর্টাল · NID Login",
      desc: "Search your booth, cast vote, view results & slip.",
      link: "/voter/login",
      border: "border-green-500/20",
      bg: "hover:bg-green-500/10",
      text: "text-green-400",
    },
  ];

  const officerPortals = [
    {
      icon: "📝",
      title: "Asst. Presiding Officer",
      subtitle: "Booth vote entry",
      link: "/officer/apo",
      text: "text-yellow-400",
      border: "border-yellow-500/20",
      bg: "hover:bg-yellow-500/10",
    },
    {
      icon: "🏛️",
      title: "Presiding Officer",
      subtitle: "Verify station results",
      link: "/officer/po",
      text: "text-orange-400",
      border: "border-orange-500/20",
      bg: "hover:bg-orange-500/10",
    },
    {
      icon: "📋",
      title: "Asst. Returning Officer",
      subtitle: "Compile constituency",
      link: "/officer/aro",
      text: "text-purple-400",
      border: "border-purple-500/20",
      bg: "hover:bg-purple-500/10",
    },
    {
      icon: "⚖️",
      title: "Returning Officer",
      subtitle: "Final approval",
      link: "/officer/ro",
      text: "text-red-400",
      border: "border-red-500/20",
      bg: "hover:bg-red-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-[#06090f] text-white">
      <Navbar />

      {/* hero */}
      <div className="text-center pt-12 md:pt-16 pb-8 md:pb-10 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 mb-5">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-red-400 tracking-widest font-bold">
            ELECTION IN PROGRESS
          </span>
        </div>

        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-3"
          style={{
            background: "linear-gradient(135deg, #e8b84b, #fff 45%, #4caf50)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          জাতীয় সংসদ নির্বাচন ২০২৪
        </h1>
        <p className="text-white/40 text-base md:text-lg mb-6">
          12th National Parliamentary Election · January 7, 2024
        </p>

        {/* ticker */}
        <div className="inline-flex flex-wrap justify-center gap-4 md:gap-8 px-5 md:px-8 py-3 bg-yellow-500/5 border border-yellow-500/15 rounded-2xl md:rounded-full text-xs md:text-sm mb-10 md:mb-14">
          <span>
            🗳️{" "}
            <b className="text-yellow-400 font-mono">
              {totalVotes().toLocaleString()}
            </b>{" "}
            votes
          </span>
          <span>
            📊 <b className="text-green-400">{turnout()}%</b> turnout
          </span>
          <span>
            🏫 <b className="text-blue-400">847/1,200</b> stations
          </span>
          <span>
            🚨 <b className="text-orange-400">2</b> flags
          </span>
        </div>
      </div>

      {/* portal cards */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* main 2 portals */}
          {portals.map((p) => (
            <div
              key={p.title}
              onClick={() => navigate(p.link)}
              className={`rounded-2xl p-6 md:p-7 cursor-pointer border ${p.border} ${p.bg} bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
            >
              <div className="text-4xl mb-4">{p.icon}</div>
              <div className={`text-xl font-bold ${p.text} mb-1`}>
                {p.title}
              </div>
              <div className="text-xs text-white/30 mb-3">{p.subtitle}</div>
              <div className="text-sm text-white/50 leading-relaxed">
                {p.desc}
              </div>
              <div className={`mt-4 text-xs ${p.text}`}>Enter →</div>
            </div>
          ))}

          {/* officer portals — stacked in 3rd column on desktop, flat on mobile */}
          <div className="flex flex-col gap-3">
            {officerPortals.map((p) => (
              <div
                key={p.title}
                onClick={() => navigate(p.link)}
                className={`rounded-xl px-4 py-3.5 cursor-pointer border ${p.border} ${p.bg} bg-white/[0.03] transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-3`}
              >
                <span className="text-2xl">{p.icon}</span>
                <div className="flex-1">
                  <div className={`text-sm font-bold ${p.text}`}>{p.title}</div>
                  <div className="text-xs text-white/30">{p.subtitle}</div>
                </div>
                <span className={`text-xs ${p.text}`}>→</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
