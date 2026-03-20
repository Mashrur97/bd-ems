import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useElection } from "../store/ElectionContext";
import { CANDIDATES, CONSTITUENCIES } from "../data/mockData";
import VoteBar from "../components/VoteBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StatCard from "../components/StatCard";
import CountUp from "../components/CountUp";
import Hyperspeed from "../reactbits/Hyperspeed";
import { Vote, TrendingUp, Building2, AlertTriangle } from "lucide-react";

export default function Guest() {
  const navigate = useNavigate();
  const { votes, totalVotes, turnout, fraudFlags } = useElection();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const lead = CANDIDATES.reduce((a, b) => (votes[a.id] > votes[b.id] ? a : b));

  // fixed random values so they dont change on every render
  const constituencyStats = useMemo(
    () =>
      CONSTITUENCIES.map((c) => ({
        ...c,
        votes: Math.floor(800 + Math.random() * 200),
        pct: Math.floor(60 + Math.random() * 30),
      })),
    [],
  );

  return (
    <div className="min-h-screen bg-[#06090f] text-white flex flex-col">
      {/* hyperspeed bg */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.6,
        }}
      >
        <Hyperspeed />
      </div>

      {/* all content above bg */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navbar
          title="NATIONAL RESULTS CENTER"
          subtitle="জাতীয় ফলাফল · Live Feed"
          backTo="/"
          rightContent={
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-400 tracking-widest font-bold hidden sm:block">
                LIVE
              </span>
            </div>
          }
        />

        <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-5">
          {/* stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <StatCard
              icon={<Vote size={22} className="text-yellow-400" />}
              value={totalVotes()}
              label="VOTES CAST"
              color="text-yellow-400"
              border="border-yellow-500/20"
            />
            <StatCard
              icon={<TrendingUp size={22} className="text-green-400" />}
              value={parseFloat(turnout())}
              label="TURNOUT"
              color="text-green-400"
              border="border-green-500/20"
              isPercent
            />
            <StatCard
              icon={<Building2 size={22} className="text-blue-400" />}
              value={847}
              label="REPORTING"
              color="text-blue-400"
              border="border-blue-500/20"
            />
            <StatCard
              icon={<AlertTriangle size={22} className="text-red-400" />}
              value={fraudFlags.length}
              label="FRAUD FLAGS"
              color="text-red-400"
              border="border-red-500/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* results */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <div className="bg-black/40 backdrop-blur border border-yellow-500/20 rounded-2xl p-5 md:p-6">
                <div className="text-[10px] tracking-widest text-yellow-400 font-bold mb-4">
                  ▶ CANDIDATE RESULTS
                </div>
                <VoteBar />
              </div>
              <div className="bg-black/40 backdrop-blur border border-white/10 rounded-2xl p-4 md:p-5">
                <div className="text-[10px] tracking-widest text-white/30 mb-3">
                  CONSTITUENCY BREAKDOWN
                </div>
                {constituencyStats.map((c) => (
                  <div
                    key={c.id}
                    className="flex justify-between py-2.5 border-b border-white/5 text-sm last:border-0"
                  >
                    <span className="text-white/50 text-xs md:text-sm">
                      {c.name}
                    </span>
                    <span className="font-mono text-yellow-400 text-xs">
                      {c.votes.toLocaleString()}{" "}
                      <span className="text-white/30">{c.pct}%</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* side panel */}
            <div className="flex flex-col gap-4">
              <div
                className="bg-black/40 backdrop-blur rounded-2xl p-5 text-center border transition-all"
                style={{
                  borderColor: lead.color + "44",
                  background: lead.color + "12",
                }}
              >
                <div className="text-[10px] tracking-widest text-white/30 mb-2">
                  CURRENTLY LEADING
                </div>
                <div className="text-4xl mb-2">{lead.symbol}</div>
                <div className="text-base font-bold text-yellow-400">
                  {lead.name}
                </div>
                <div className="text-xs text-white/30 mb-3">{lead.party}</div>
                <div
                  className="font-mono text-3xl font-bold"
                  style={{ color: lead.color }}
                >
                  <CountUp end={votes[lead.id]} />
                </div>
                <div className="text-[10px] text-white/30 mt-1">VOTES</div>
              </div>

              <div className="bg-black/40 backdrop-blur border border-red-500/20 rounded-2xl p-4">
                <div className="text-[10px] tracking-widest text-red-400 font-bold mb-3">
                  ⚠ FRAUD FLAGS
                </div>
                {fraudFlags.length === 0 ? (
                  <div className="text-xs text-white/30">No active flags</div>
                ) : (
                  fraudFlags.map((f, i) => (
                    <div
                      key={i}
                      className="py-2 border-b border-white/5 last:border-0"
                    >
                      <div
                        className={`text-xs font-bold mb-0.5 ${f.severity === "high" ? "text-red-400" : "text-orange-400"}`}
                      >
                        ⚠ {f.booth}
                      </div>
                      <div className="text-[11px] text-white/40">{f.issue}</div>
                    </div>
                  ))
                )}
              </div>

              <div className="bg-black/40 backdrop-blur border border-white/10 rounded-2xl p-4">
                <div className="text-[10px] tracking-widest text-white/30 mb-3">
                  ELECTION TIMELINE
                </div>
                {[
                  { time: "07:00", label: "Polling Opened", done: true },
                  { time: "09:14", label: "First Results", done: true },
                  { time: "Now", label: "Live Counting", active: true },
                  { time: "17:00", label: "Polling Closes", done: false },
                  { time: "21:00", label: "Results Final", done: false },
                ].map((e) => (
                  <div
                    key={e.time}
                    className="flex items-center gap-2 py-1.5 text-xs"
                  >
                    <span
                      className={`text-[10px] ${e.active ? "text-yellow-400" : e.done ? "text-green-400" : "text-white/20"}`}
                    >
                      ●
                    </span>
                    <span className="text-white/30 font-mono w-10">
                      {e.time}
                    </span>
                    <span
                      className={
                        e.active
                          ? "text-white"
                          : e.done
                            ? "text-white/50"
                            : "text-white/20"
                      }
                    >
                      {e.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
