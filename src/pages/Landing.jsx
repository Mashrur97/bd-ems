import { useNavigate } from "react-router-dom";
import { useElection } from "../store/ElectionContext";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Particles from "../reactbits/Particles";
import BlurText from "../reactbits/BlurText";
import {
  Radio,
  UserCheck,
  PenLine,
  ShieldCheck,
  ClipboardList,
  Scale,
  Vote,
  BarChart2,
  Building2,
  AlertTriangle,
} from "lucide-react";

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
      icon: <Radio size={36} className="text-blue-400" />,
      title: "Live Results",
      subtitle: "সরাসরি ফলাফল · Guest Mode",
      desc: "Real-time national vote count. No login needed.",
      link: "/guest",
      border: "border-blue-500/20",
      bg: "hover:bg-blue-500/10",
      text: "text-blue-400",
    },
    {
      icon: <UserCheck size={36} className="text-green-400" />,
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
      icon: <PenLine size={20} className="text-yellow-400" />,
      title: "Asst. Presiding Officer",
      subtitle: "Booth vote entry",
      link: "/officer/apo",
      text: "text-yellow-400",
      border: "border-yellow-500/20",
      bg: "hover:bg-yellow-500/10",
    },
    {
      icon: <ShieldCheck size={20} className="text-orange-400" />,
      title: "Presiding Officer",
      subtitle: "Verify station results",
      link: "/officer/po",
      text: "text-orange-400",
      border: "border-orange-500/20",
      bg: "hover:bg-orange-500/10",
    },
    {
      icon: <ClipboardList size={20} className="text-purple-400" />,
      title: "Asst. Returning Officer",
      subtitle: "Compile constituency",
      link: "/officer/aro",
      text: "text-purple-400",
      border: "border-purple-500/20",
      bg: "hover:bg-purple-500/10",
    },
    {
      icon: <Scale size={20} className="text-red-400" />,
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

      {/* particles as full page background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <Particles
          particleColors={["#ffffff", "#e8b84b"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>

      {/* all content above particles */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* hero */}
        <div className="text-center pt-12 md:pt-16 pb-8 md:pb-10 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 mb-5">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-red-400 tracking-widest font-bold">
              ELECTION IN PROGRESS
            </span>
          </div>

          <div className="flex justify-center mb-3 gradient-text">
            <BlurText
              text="জাতীয় সংসদ নির্বাচন ২০২৬"
              delay={200}
              animateBy="words"
              direction="top"
              className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight text-center"
            />
          </div>

          <p className="text-white/40 text-base md:text-lg mb-6">
            12th National Parliamentary Election · February 12, 2026
          </p>

          {/* ticker */}
          <div className="inline-flex flex-wrap justify-center gap-4 md:gap-8 px-5 md:px-8 py-3 bg-yellow-500/5 border border-yellow-500/15 rounded-2xl md:rounded-full text-xs md:text-sm mb-10 md:mb-14">
            <span className="flex items-center gap-1.5">
              <Vote size={14} className="text-yellow-400" />
              <b className="text-yellow-400 font-mono">
                {totalVotes().toLocaleString()}
              </b>{" "}
              votes
            </span>
            <span className="flex items-center gap-1.5">
              <BarChart2 size={14} className="text-green-400" />
              <b className="text-green-400">{turnout()}%</b> turnout
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 size={14} className="text-blue-400" />
              <b className="text-blue-400">847/1,200</b> stations
            </span>
            <span className="flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-orange-400" />
              <b className="text-orange-400">2</b> flags
            </span>
          </div>
        </div>

        {/* portal cards */}
        <div className="max-w-5xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {portals.map((p) => (
              <div
                key={p.title}
                onClick={() => navigate(p.link)}
                className={`rounded-2xl p-6 md:p-7 cursor-pointer border ${p.border} ${p.bg} bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
              >
                <div className="mb-4">{p.icon}</div>
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

            <div className="flex flex-col gap-3">
              {officerPortals.map((p) => (
                <div
                  key={p.title}
                  onClick={() => navigate(p.link)}
                  className={`rounded-xl px-4 py-3.5 cursor-pointer border ${p.border} ${p.bg} bg-white/[0.03] transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-3`}
                >
                  <span>{p.icon}</span>
                  <div className="flex-1">
                    <div className={`text-sm font-bold ${p.text}`}>
                      {p.title}
                    </div>
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
    </div>
  );
}
