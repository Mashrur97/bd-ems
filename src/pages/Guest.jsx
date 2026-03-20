import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useElection } from "../store/ElectionContext";
import { CANDIDATES, CONSTITUENCIES } from "../data/mockData";
import VoteBar from "../components/VoteBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Guest() {
  const navigate = useNavigate();
  const { votes, totalVotes, turnout, fraudFlags } = useElection();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const lead = CANDIDATES.reduce((a, b) => votes[a.id] > votes[b.id] ? a : b);

  return (
    <div className="min-h-screen bg-[#06090f] text-white flex flex-col">
      <Navbar
        title="NATIONAL RESULTS CENTER"
        subtitle="জাতীয় ফলাফল · Live Feed"
        backTo="/"
        rightContent={
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-red-400 tracking-widest font-bold hidden sm:block">LIVE</span>
          </div>
        }
      />

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-5">
        {/* stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { icon: "🗳️", val: totalVotes().toLocaleString(), label: "VOTES CAST", color: "text-yellow-400", border: "border-yellow-500/20" },
            { icon: "📈", val: turnout() + "%", label: "TURNOUT", color: "text-green-400", border: "border-green-500/20" },
            { icon: "🏫", val: "847", label: "REPORTING", color: "text-blue-400", border: "border-blue-500/20" },
            { icon: "🚨", val: fraudFlags.length.toString(), label: "FRAUD FLAGS", color: "text-red-400", border: "border-red-500/20" },
          ].map((s) => (
            <div key={s.label} className={`bg-white/[0.03] border ${s.border} rounded-2xl p-3 md:p-4 text-center`}>
              <div className="text-xl md:text-2xl mb-1">{s.icon}</div>
              <div className={`font-mono text-xl md:text-2xl font-bold ${s.color}`}>{s.val}</div>
              <div className="text-[9px] md:text-[10px] text-white/30 tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* results */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="bg-white/[0.03] border border-yellow-500/20 rounded-2xl p-5 md:p-6">
              <div className="text-[10px] tracking-widest text-yellow-400 font-bold mb-4">▶ CANDIDATE RESULTS</div>
              <VoteBar />
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 md:p-5">
              <div className="text-[10px] tracking-widest text-white/30 mb-3">CONSTITUENCY BREAKDOWN</div>
              {CONSTITUENCIES.map((c) => (
                <div key={c.id} className="flex justify-between py-2.5 border-b border-white/5 text-sm last:border-0">
                  <span className="text-white/50 text-xs md:text-sm">{c.name}</span>
                  <span className="font-mono text-yellow-400 text-xs">{(Math.floor(800 + Math.random() * 200)).toLocaleString()} <span className="text-white/30">{Math.floor(60 + Math.random() * 30)}%</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* side panel */}
          <div className="flex flex-col gap-4">
            <div className="bg-white/[0.03] rounded-2xl p-5 text-center border transition-all"
              style={{ borderColor: lead.color + "44", background: lead.color + "12" }}>
              <div className="text-[10px] tracking-widest text-white/30 mb-2">CURRENTLY LEADING</div>
              <div className="text-4xl mb-2">{lead.symbol}</div>
              <div className="text-base font-bold text-yellow-400">{lead.name}</div>
              <div className="text-xs text-white/30 mb-3">{lead.party}</div>
              <div className="font-mono text-3xl font-bold" style={{ color: lead.color }}>
                {votes[lead.id].toLocaleString()}
              </div>
              <div className="text-[10px] text-white/30 mt-1">VOTES</div>
            </div>

            <div className="bg-white/[0.03] border border-red-500/20 rounded-2xl p-4">
              <div className="text-[10px] tracking-widest text-red-400 font-bold mb-3">⚠ FRAUD FLAGS</div>
              {fraudFlags.length === 0
                ? <div className="text-xs text-white/30">No active flags</div>
                : fraudFlags.map((f, i) => (
                  <div key={i} className="py-2 border-b border-white/5 last:border-0">
                    <div className={`text-xs font-bold mb-0.5 ${f.severity === "high" ? "text-red-400" : "text-orange-400"}`}>⚠ {f.booth}</div>
                    <div className="text-[11px] text-white/40">{f.issue}</div>
                  </div>
                ))}
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
              <div className="text-[10px] tracking-widest text-white/30 mb-3">ELECTION TIMELINE</div>
              {[
                { time: "07:00", label: "Polling Opened", done: true },
                { time: "09:14", label: "First Results", done: true },
                { time: "Now", label: "Live Counting", active: true },
                { time: "17:00", label: "Polling Closes", done: false },
                { time: "21:00", label: "Results Final", done: false },
              ].map((e) => (
                <div key={e.time} className="flex items-center gap-2 py-1.5 text-xs">
                  <span className={`text-[10px] ${e.active ? "text-yellow-400" : e.done ? "text-green-400" : "text-white/20"}`}>●</span>
                  <span className="text-white/30 font-mono w-10">{e.time}</span>
                  <span className={e.active ? "text-white" : e.done ? "text-white/50" : "text-white/20"}>{e.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}